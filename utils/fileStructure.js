import matter from 'gray-matter'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

// Available components for shortcodes
const AVAILABLE_COMPONENTS = {}

// Process shortcodes in content
const processShortcodes = (content, components = {}) => {
  // Pattern to match shortcodes like [ComponentName] or [ComponentName title="Custom Title"]
  const shortcodePattern = /\[(\w+)([^\]]*)\]/g
  
  return content.replace(shortcodePattern, (match, componentName, attributes) => {
    const Component = AVAILABLE_COMPONENTS[componentName]
    if (!Component) {
      console.warn(`Component "${componentName}" not found`)
      return match // Return original if component not found
    }
    
    // Parse attributes (simple key="value" parsing)
    const props = {}
    const attrPattern = /(\w+)="([^"]*)"/g
    let attrMatch
    while ((attrMatch = attrPattern.exec(attributes)) !== null) {
      const [, key, value] = attrMatch
      // Convert string booleans to actual booleans
      if (value === 'true') props[key] = true
      else if (value === 'false') props[key] = false
      else props[key] = value
    }
    
    // Store component info for later rendering
    const componentId = `component_${Math.random().toString(36).substr(2, 9)}`
    components[componentId] = { Component, props }
    
    // Return placeholder that will be replaced during React rendering
    return `<div data-component="${componentId}"></div>`
  })
}

// File structure configuration
// Items are sorted by the 'order' property. Lower numbers appear first.
// Items without an 'order' property will appear last (order: 999)
const fileStructure = [
  { type: 'file', name: 'resume.pdf', title: 'Resume', path: 'resume.pdf', order: 1 },
  { type: 'file', name: 'education.md', title: 'Education', path: 'education.md', order: 2 },
  { type: 'file', name: 'experience.md', title: 'Experience', path: 'experience.md', order: 3 },
  { type: 'file', name: 'projects-internships.md', title: 'Projects & Internships', path: 'projects-internships.md', order: 4 },
  { type: 'file', name: 'tech-learnings.md', title: 'Tech Learnings', path: 'tech-learnings.md', order: 5 },
  { type: 'file', name: 'contact.md', title: 'Contact Me', path: 'contact.md', order: 6 },
  { 
    type: 'folder', 
    name: 'random',
    title: 'Random',
    path: 'random',
    icon: 'fa-folder',
    order: 7,
    children: [
      { type: 'file', name: 'scratchpad.md', title: 'Scratchpad', path: 'random/scratchpad.md', order: 1 }
    ]
  }
]

// Mock content for files that don't have actual markdown files yet
const mockContent = {}

// Parse markdown content
export const parseMarkdown = (content) => {
  const { data: frontmatter, content: markdownContent } = matter(content)
  
  // Process shortcodes first
  const components = {}
  let processedContent = processShortcodes(markdownContent, components)
  
  // Use marked with minimal configuration to avoid object issues
  let rawHtml
  try {
    rawHtml = marked.parse(processedContent, {
      breaks: false,
      gfm: true,
      headerIds: false,
      mangle: false
    })
    
    // Ensure we have a string
    if (typeof rawHtml !== 'string') {
      console.error('Marked returned non-string:', typeof rawHtml, rawHtml)
      rawHtml = processedContent
    }
  } catch (error) {
    console.error('Marked parsing error:', error)
    rawHtml = processedContent
  }
  
  // Sanitize HTML but allow form elements and attributes
  const htmlContent = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'code', 'pre', 'blockquote', 'hr',
      'div', 'span', 'form', 'input', 'textarea', 'select', 'option', 
      'label', 'button', 'i', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'src', 'alt', 'class', 'id', 'type', 'name', 
      'value', 'placeholder', 'required', 'rows', 'method', 'action',
      'for', 'data-netlify', 'netlify-honeypot', 'target', 'rel', 'style',
      'data-component', 'selected'
    ],
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: true
  })
  
  return { frontmatter, htmlContent, markdownContent, components }
}

// Detect file type from path
export const getFileType = (filePath) => {
  const extension = filePath.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'md':
      return 'markdown'
    case 'pdf':
      return 'pdf'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return 'image'
    case 'mp4':
    case 'webm':
      return 'video'
    case 'json':
      return 'json'
    case 'js':
    case 'ts':
      return 'code'
    default:
      return 'unknown'
  }
}

// Get file content (supports multiple file types)
export const getFileContent = async (filePath) => {
  const fileType = getFileType(filePath)
  
  try {
    // Handle different file types
    switch (fileType) {
      case 'markdown':
        // Try to fetch markdown files (don't append .md if already present)
        const mdFilePath = filePath.endsWith('.md') ? filePath : `${filePath}.md`
        const mdResponse = await fetch(`/content/${mdFilePath}`)
        if (mdResponse.ok) {
          const content = await mdResponse.text()
          return { ...parseMarkdown(content), fileType: 'markdown' }
        }
        break
        
      case 'pdf':
        // For PDFs, just return metadata and URL
        const pdfUrl = `/content/${filePath}`
        return {
          fileType: 'pdf',
          url: pdfUrl,
          frontmatter: { 
            title: filePath.split('/').pop(),
            type: 'pdf'
          }
        }
        
      case 'image':
        // For images, return image metadata
        const imageUrl = `/content/${filePath}`
        return {
          fileType: 'image',
          url: imageUrl,
          frontmatter: { 
            title: filePath.split('/').pop(),
            type: 'image'
          }
        }
        
      case 'json':
        // For JSON files, fetch and format
        const jsonResponse = await fetch(`/content/${filePath}`)
        if (jsonResponse.ok) {
          const jsonContent = await jsonResponse.text()
          return {
            fileType: 'json',
            content: jsonContent,
            frontmatter: { 
              title: filePath.split('/').pop(),
              type: 'json'
            }
          }
        }
        break
    }
  } catch (error) {
    console.error('Error fetching file:', error)
  }
  
  // Fallback to mock content for markdown
  const mockData = mockContent[filePath]
  if (mockData) {
    return { ...parseMarkdown(mockData), fileType: 'markdown' }
  }
  
  return null
}

// Get file icon by path
export const getFileIcon = (filePath) => {
  const extension = filePath.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'md':
      return 'fa-file-alt'
    case 'pdf':
      return 'fa-file-pdf'
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
      return 'fa-file-code'
    case 'json':
      return 'fa-file-code'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return 'fa-file-image'
    case 'mp4':
    case 'webm':
      return 'fa-file-video'
    case 'zip':
    case 'rar':
      return 'fa-file-archive'
    default:
      return 'fa-file'
  }
}

// Get file structure
// Helper function to sort file structure by order
const sortFileStructure = (items) => {
  return items
    .map(item => ({
      ...item,
      children: item.children ? sortFileStructure(item.children) : item.children
    }))
    .sort((a, b) => (a.order || 999) - (b.order || 999))
}

export const getFileStructure = () => sortFileStructure(fileStructure) 