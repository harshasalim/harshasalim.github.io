'use client'

import { useState, useEffect, useCallback } from 'react'
import { getFileIcon } from '../utils/fileStructure'

// Helper function to render markdown with components
const renderMarkdownWithComponents = (htmlContent, components) => {
  // If no components, just return the HTML
  if (!components || Object.keys(components).length === 0) {
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  }
  
  // Split content by component placeholders
  const parts = htmlContent.split(/(<div data-component="[^"]+"><\/div>)/g)
  
  return (
    <>
      {parts.map((part, index) => {
        // Check if this part is a component placeholder
        const componentMatch = part.match(/<div data-component="([^"]+)"><\/div>/)
        if (componentMatch) {
          const componentId = componentMatch[1]
          const componentData = components[componentId]
          if (componentData) {
            const { Component, props } = componentData
            return <Component key={componentId} {...props} />
          }
        }
        
        // Regular HTML content
        return part ? (
          <div key={index} dangerouslySetInnerHTML={{ __html: part }} />
        ) : null
      })}
    </>
  )
}

// Constants
const THEME_STORAGE_KEY = 'vscode-theme'
const THEME_ORDER = ['auto', 'light', 'dark']
const THEME_ICONS = {
  auto: 'fa-adjust',
  light: 'fa-sun',
  dark: 'fa-moon'
}
let IFRAME_HEIGHT = '600px'

// Helper function for file headers
const createFileHeader = (frontmatter) => frontmatter?.title && (
  <div className="file-header">
    <h2>{frontmatter.title}</h2>
    {frontmatter.type && (
      <span className="file-type">{frontmatter.type}</span>
    )}
  </div>
)

// File Tree Item Component
const FileTreeItem = ({ item, currentFile, handleFileItemClick, toggleFolder }) => {
  if (item.type === 'folder') {
    return (
      <div className="file-item folder" onClick={toggleFolder}>
        <div className="file-item-header">
          <i className="fas fa-chevron-right folder-arrow"></i>
          <i className={`fas ${item.icon || 'fa-folder'}`}></i>
          <span>{item.title || item.name}</span>
        </div>
        {item.children && (
          <div className="file-children">
            {item.children.map((child, index) => (
              <FileTreeItem 
                key={index}
                item={child}
                currentFile={currentFile}
                handleFileItemClick={handleFileItemClick}
                toggleFolder={toggleFolder}
              />
            ))}
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div 
        className={`file-item ${currentFile === item.path ? 'selected' : ''}`}
        onClick={(e) => handleFileItemClick(e, item.path, false)}
      >
        <div className="file-item-header">
          <i className={`fas ${getFileIcon(item.path)}`}></i>
          <span>{item.title || item.name}</span>
        </div>
      </div>
    )
  }
}

export default function Home() {
  // Application State - always start with welcome to avoid hydration mismatch
  const [currentFile, setCurrentFile] = useState('welcome')
  const [openTabs, setOpenTabs] = useState(['welcome'])
  const [currentTheme, setCurrentTheme] = useState('auto')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isClientMounted, setIsClientMounted] = useState(false)

  // File content cache
  const [fileContents, setFileContents] = useState({})
  
  // File structure
  const [fileStructure, setFileStructure] = useState([])

  // Helper function to get display title for a file path
  const getFileTitle = useCallback((filePath) => {
    if (filePath === 'welcome') return 'Welcome'
    
    const findTitle = (items) => {
      for (const item of items) {
        if (item.path === filePath) {
          return item.title || item.name
        }
        if (item.children) {
          const title = findTitle(item.children)
          if (title) return title
        }
      }
      return null
    }
    
    const title = findTitle(fileStructure)
    return title || (filePath.includes('/') ? filePath.split('/').pop() : filePath)
  }, [fileStructure])

  // Apply theme
  const applyTheme = useCallback((theme) => {
    document.body.setAttribute('data-theme', theme)
  }, [])

  // Toggle theme
  const toggleTheme = useCallback(() => {
    const currentIndex = THEME_ORDER.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % THEME_ORDER.length
    const newTheme = THEME_ORDER[nextIndex]
    
    setCurrentTheme(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    applyTheme(newTheme)
  }, [currentTheme, applyTheme])

  // Close mobile sidebar when file is opened
  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false)
  }, [])

  // Open file
  const openFile = useCallback(async (fileName) => {
    if (!openTabs.includes(fileName)) {
      setOpenTabs(prev => [...prev, fileName])
    }
    setCurrentFile(fileName)
    closeMobileSidebar() // Close mobile sidebar when file opens
    
    // Update URL to reflect current file
    const url = fileName === 'welcome' ? '/' : `/?file=${encodeURIComponent(fileName)}`
    window.history.pushState({ file: fileName }, '', url)
    
    // Update document title
    const displayName = getFileTitle(fileName)
    const title = fileName === 'welcome' ? 'Harsha Salim' : `${displayName} - Harsha Salim`
    document.title = title
    
    // Load content if not already cached
    if (fileName !== 'welcome' && !fileContents[fileName]) {
      try {
        const { getFileContent } = await import('../utils/fileStructure')
        const content = await getFileContent(fileName)
        if (content) {
          setFileContents(prev => ({ ...prev, [fileName]: content }))
        }
      } catch (error) {
        console.error('Error loading file content:', error)
      }
    }
  }, [openTabs, fileContents, closeMobileSidebar, getFileTitle])

  // Close tab
  const closeTab = useCallback((fileName) => {
    if (fileName === 'welcome') return
    
    setOpenTabs(prev => {
      const newTabs = prev.filter(tab => tab !== fileName)
      // Switch to adjacent tab if current was closed
      if (fileName === currentFile) {
        const tabIndex = prev.indexOf(fileName)
        const newActiveFile = newTabs[Math.max(0, Math.min(tabIndex, newTabs.length - 1))]
        setCurrentFile(newActiveFile)
        
        // Update URL when closing current tab
        const url = newActiveFile === 'welcome' ? '/' : `/?file=${encodeURIComponent(newActiveFile)}`
        window.history.pushState({ file: newActiveFile }, '', url)
        
        // Update document title
        const displayName = getFileTitle(newActiveFile)
        const title = newActiveFile === 'welcome' ? 'Harsha Salim' : `${displayName} - Harsha Salim`
        document.title = title
      }
      return newTabs
    })
  }, [currentFile, getFileTitle])

  // Close current file
  const closeCurrentFile = useCallback(() => {
    if (currentFile !== 'welcome') {
      closeTab(currentFile)
    }
  }, [currentFile, closeTab])

  // Switch to tab
  const switchToTab = useCallback((fileName) => {
    setCurrentFile(fileName)
    
    // Update URL when switching tabs
    const url = fileName === 'welcome' ? '/' : `/?file=${encodeURIComponent(fileName)}`
    window.history.pushState({ file: fileName }, '', url)
    
    // Update document title
    const displayName = getFileTitle(fileName)
    const title = fileName === 'welcome' ? 'Harsha Salim' : `${displayName} - Harsha Salim`
    document.title = title
  }, [getFileTitle])

  // Toggle folder
  const toggleFolder = useCallback((e) => {
    e.stopPropagation() // Prevent event bubbling to parent folders
    const folderElement = e.currentTarget
    folderElement.classList.toggle('expanded')
    
    // Update arrow icon (like original)
    const arrow = folderElement.querySelector('.folder-arrow')
    if (arrow) {
      arrow.className = folderElement.classList.contains('expanded') 
        ? 'fas fa-chevron-down folder-arrow'
        : 'fas fa-chevron-right folder-arrow'
    }
  }, [])

  // Handle file item click (matches original logic)
  const handleFileItemClick = useCallback((e, fileName, isFolder) => {
    e.stopPropagation()
    if (isFolder) {
      return // Folder click is handled by toggleFolder
    } else {
      openFile(fileName)
    }
  }, [openFile])

  // Get theme icon
  const getThemeIcon = useCallback((theme) => THEME_ICONS[theme], [])

  // Toggle mobile sidebar
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev)
  }, [])

  // Client-side mount detection
  useEffect(() => {
    setIsClientMounted(true)
  }, [])

  // Handle URL routing on client mount
  useEffect(() => {
    if (!isClientMounted) return

    const getFileFromURL = () => {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get('file') || 'welcome'
    }

    const urlFile = getFileFromURL()
    if (urlFile !== 'welcome') {
      // Open the file from URL
      if (!openTabs.includes(urlFile)) {
        setOpenTabs(prev => [...prev, urlFile])
      }
      setCurrentFile(urlFile)

      // Load content
      const loadUrlFile = async () => {
        if (!fileContents[urlFile]) {
          try {
            const { getFileContent } = await import('../utils/fileStructure')
            const content = await getFileContent(urlFile)
            if (content) {
              setFileContents(prev => ({ ...prev, [urlFile]: content }))
            }
          } catch (error) {
            console.error('Error loading URL file content:', error)
          }
        }
      }
      loadUrlFile()
    }

    // Set document title
    const displayName = getFileTitle(urlFile)
    const title = urlFile === 'welcome' ? 'Harsha Salim' : `${displayName} - Harsha Salim`
    document.title = title

    // Handle browser back/forward navigation
    const handlePopState = (event) => {
      const file = event.state?.file || getFileFromURL()
      setCurrentFile(file)
      if (!openTabs.includes(file)) {
        setOpenTabs(prev => [...prev, file])
      }
      
      // Update document title
      const displayName = getFileTitle(file)
      const title = file === 'welcome' ? 'Harsha Salim' : `${displayName} - Harsha Salim`
      document.title = title
    }
    
    window.addEventListener('popstate', handlePopState)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isClientMounted, openTabs, fileContents, getFileTitle])

  // Initialize theme and file structure, and extract window height
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'auto'
    setCurrentTheme(savedTheme)
    applyTheme(savedTheme)

    // Find the height of the window
    IFRAME_HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    
    // Import and set file structure
    const loadFileStructure = async () => {
      try {
        const { getFileStructure } = await import('../utils/fileStructure')
        setFileStructure(getFileStructure())
      } catch (error) {
        console.error('Error loading file structure:', error)
        // Fallback to hardcoded structure
        setFileStructure([
          { type: 'file', name: 'contact.md', path: 'contact.md' }
        ])
      }
    }
    loadFileStructure()
  }, []) // Removed dependencies to prevent infinite loop

  // Separate effect to expose global functions
  useEffect(() => {
    // Expose global functions for welcome screen buttons
    window.openFile = openFile
    window.toggleTheme = toggleTheme
    
    // Cleanup on unmount
    return () => {
      delete window.openFile
      delete window.toggleTheme
    }
  }, [openFile, toggleTheme])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyboardShortcuts = (e) => {
      // Ctrl+W or Cmd+W to close current tab
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault()
        closeCurrentFile()
      }
      
      // Ctrl+Shift+P or Cmd+Shift+P to toggle theme
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        toggleTheme()
      }
    }

    document.addEventListener('keydown', handleKeyboardShortcuts)
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts)
  }, [closeCurrentFile, toggleTheme])

  // Handle contact form submission
  useEffect(() => {
    const form = document.getElementById('contact-form');
    if (!form) {
      return;
    }
    
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const formStatus = document.getElementById('form-status');
    const statusMessage = document.getElementById('status-message');
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Check honeypot
      const honeypot = form.querySelector('input[name="honeypot"]');
      if (honeypot && honeypot.value) {
        return; // Likely spam, silently reject
      }
      
      // Get form data
      const formData = new FormData(form);
      const data = {
        name: formData.get('fullname'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
      };
      
      // Validation with trimming
      const trimmedData = {
        name: data.name?.trim(),
        email: data.email?.trim(),
        subject: data.subject?.trim(),
        message: data.message?.trim()
      };
      
      if (!trimmedData.name || !trimmedData.email || !trimmedData.subject || !trimmedData.message) {
        showStatus('error', 'Please fill in all required fields.');
        return;
      }
      
      // Use trimmed data for submission
      Object.assign(data, trimmedData);
      
      // Set loading state
      setLoadingState(true);
      
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          showStatus('success', 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!');
          form.reset();
        } else {
          const result = await response.json();
          console.error('API Error:', result);
          showStatus('error', result.error || `Server error (${response.status}). Please try again later.`);
        }
      } catch (error) {
        console.error('Form submission error:', error);
        showStatus('error', 'Network error. Please check your connection and try again.');
      } finally {
        setLoadingState(false);
      }
    };
    
    const setLoadingState = (loading) => {
      if (loading) {
        submitBtn.disabled = true;
        submitText.textContent = 'Sending...';
        submitBtn.querySelector('i').className = 'fas fa-spinner fa-spin';
      } else {
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        submitBtn.querySelector('i').className = 'fas fa-paper-plane';
      }
    };
    
    const showStatus = (type, message) => {
      statusMessage.textContent = message;
      formStatus.className = `form-status ${type}`;
      formStatus.style.display = 'block';
      
      // Scroll to status message
      formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Auto-hide success messages after 5 seconds
      if (type === 'success') {
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);
      }
    };

    form.addEventListener('submit', handleSubmit);
    
    return () => {
      form.removeEventListener('submit', handleSubmit);
    };
  }, [currentFile, fileContents]) // Re-run when content changes

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileSidebarOpen])

  // Escape HTML
  const escapeHtml = useCallback((text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }
    return text.replace(/[&<>"']/g, m => map[m])
  }, [])

  // Render different file types
  const renderFileContent = useCallback((content, fileName) => {
    if (!content) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3>Loading...</h3>
          <p>Loading content for &quot;{fileName}&quot;...</p>
        </div>
      )
    }

    const { fileType, frontmatter } = content
    const fileHeader = createFileHeader(frontmatter)

    switch (fileType) {
      case 'markdown':
        return (
          <div className="markdown-content">
            {fileHeader}
            <div className="markdown-body">
              {renderMarkdownWithComponents(content.htmlContent, content.components)}
            </div>
          </div>
        )

      case 'pdf':
        return (
          <div className="pdf-content">
            {fileHeader}
            <div className="pdf-viewer">
              <div className="pdf-actions">
                <a 
                  href={content.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-btn"
                >
                  <i className="fas fa-external-link-alt"></i> Open in New Tab
                </a>
                <a 
                  href={content.url} 
                  download
                  className="action-btn"
                >
                  <i className="fas fa-download"></i> Download PDF
                </a>
              </div>
              <iframe
                src={`${content.url}#navpanes=0`}
                width="100%"
                height={IFRAME_HEIGHT}
                style={{ border: '1px solid var(--border-color)', borderRadius: '4px' }}
                title={`PDF Viewer - ${fileName}`}
              />
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="image-content">
            {fileHeader}
            <div className="image-viewer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={content.url} 
                alt={fileName}
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
        )

      case 'json':
        return (
          <div className="json-content">
            {fileHeader}
            <pre className="json-viewer">
              <code>{JSON.stringify(JSON.parse(content.content), null, 2)}</code>
            </pre>
          </div>
        )

      default:
        return (
          <div className="file-content">
            {fileHeader}
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <h3>Unsupported File Type</h3>
              <p>Cannot preview &quot;{fileName}&quot; - unsupported file type.</p>
              <a 
                href={content.url || '#'} 
                className="action-btn"
                download
              >
                <i className="fas fa-download"></i> Download File
              </a>
            </div>
          </div>
        )
    }
  }, [])

  // Render editor content
  const renderEditorContent = useCallback((fileName) => {
    if (fileName === 'welcome') {
      return (
        <div className="welcome-screen">
          <header className="welcome-header">
            <h1>Harsha Salim</h1>
            <p>Hi! I'm a Computer Science graduate student. I'm a software engineer interested in distributed systems, databases and blockchain, and currently interning at Alchemy. This is my personal website inspired by VSCode.</p>
          </header>
          
          <section className="welcome-sections">
            <div className="welcome-section">
              <h3><i className="fas fa-graduation-cap"></i> University of Southern California (USC)</h3>
              <p>Graduate student at USC, Los Angeles, pursuing a Master of Science in Computer Science</p>
            </div>
            
            <div className="welcome-section">
              <h3><i className="fas fa-building"></i> Alchemy</h3>
              <p>Interning at Alchemy, New York, in the Data Services team</p>
            </div>
            
            <div className="welcome-section">
              <h3><i className="fas fa-bullseye"></i> Focus</h3>
              <p>Interested in distributed systems, databases and blockchain, and working on related projects. Let me know if you want to collaborate!</p>
            </div>
            
            <div className="welcome-section">
              <h3><i className="fas fa-handshake"></i> Open to work</h3>
              <p>Looking for 2026 full time software engineering roles, and open to remote work.</p>
            </div>
          </section>
          
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button className="action-btn" onClick={() => window.openFile?.('resume.pdf')}>
              <i className="fas fa-file-pdf"></i> View Resume
            </button>
            <button className="action-btn" onClick={() => window.openFile?.('contact.md')}>
              <i className="fas fa-file-code"></i> Open Contact Form
            </button>
          </div>
        </div>
      )
    }

    return renderFileContent(fileContents[fileName], fileName)
  }, [fileContents, renderFileContent])

  return (
    <div className={`container ${isMobileSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Menu Button */}
      <button 
        className={`mobile-menu-btn ${isMobileSidebarOpen ? 'hidden' : ''}`}
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={closeMobileSidebar}
        ></div>
      )}

      <div className="main-container">
        <aside className={`sidebar ${isMobileSidebarOpen ? 'sidebar-open' : ''}`}>
        <header className="sidebar-header">
          <span className="sidebar-title">EXPLORER</span>
          <div className="sidebar-controls">
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              title={`Current: ${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)} theme`}
            >
              <i className={`fas ${getThemeIcon(currentTheme)}`}></i>
            </button>
            <button 
              className="mobile-close-btn"
              onClick={closeMobileSidebar}
              aria-label="Close sidebar"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </header>
        
        <div className="sidebar-content">
          <div className="file-explorer">
            <div className="folder-header">
              <span>PORTFOLIO</span>
            </div>
            
            <div className="file-tree">
              {fileStructure.map((item, index) => (
                <FileTreeItem 
                  key={index}
                  item={item}
                  currentFile={currentFile}
                  handleFileItemClick={handleFileItemClick}
                  toggleFolder={toggleFolder}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className = "header-bar">
            <span>
              Harsha Salim - Personal Portfolio
            </span>
            </div>
        <div className="tab-bar">
          {openTabs.map(fileName => {
            const displayName = getFileTitle(fileName)
            return (
              <div 
                key={fileName}
                className={`tab ${currentFile === fileName ? 'active' : ''} ${fileName === 'welcome' ? 'welcome-tab' : ''}`}
                onClick={() => switchToTab(fileName)}
              >
                <span>{displayName}</span>
                {fileName !== 'welcome' && (
                  <button 
                    className="tab-close"
                    onClick={(e) => {
                      e.stopPropagation()
                      closeTab(fileName)
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="editor-area">
          {openTabs.map(fileName => (
            <div 
              key={fileName}
              className={`editor-content ${currentFile === fileName ? 'active' : ''}`}
            >
              {renderEditorContent(fileName)}
            </div>
          ))}
        </div>
      </main>
      </div>

      {/* App Footer / Status Bar */}
      <footer className="app-footer">
        <div className="status-bar">
          <div className="status-left">
            <span className="status-item">
              <i className="fas fa-check-circle"></i> Ready
            </span>
            <span className="status-item">
              <i className="fas fa-folder"></i> Portfolio
            </span>
          </div>
          <div className="status-center">
            <span className="status-item desktop-text">
              Inspired by Visual Studio Code :)
            </span>
            <span className="status-item mobile-text">
              Inspired by VSCode :)
            </span>
          </div>
          <div className="status-right">
            <span className="status-item theme-item">
              Theme: {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
            </span>
            <span className="status-item desktop-only">
              <i className="fas fa-code-branch"></i> v1.0.0
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
} 