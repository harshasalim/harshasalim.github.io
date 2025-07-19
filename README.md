# VS Code Inspired Website - Next.js

A responsive and expandable web interface inspired by Visual Studio Code, built with Next.js and deployed to Vercel.

## Features

- 🎨 **Authentic VS Code styling** - Pixel-perfect recreation of VS Code's interface
- 🌓 **Theme support** - Auto, light, and dark themes with system preference detection
- 📁 **File explorer** - Interactive file tree with expandable folders
- 📑 **Tabbed editor** - Multiple file tabs with close functionality
- ⌨️ **Keyboard shortcuts** - Ctrl+W (close tab), Ctrl+Shift+P (toggle theme)
- 📱 **Responsive design** - Works on desktop, tablet, and mobile devices
- ⚡ **Next.js powered** - Modern React framework with static export for Vercel

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

This will create a static export in the `out/` directory.

## Deployment to Vercel

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: Deploy from GitHub

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel will automatically detect Next.js and deploy

### Option 3: Drag & Drop

1. Run `npm run build`
2. Go to [vercel.com](https://vercel.com)
3. Drag and drop the `out/` folder

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles (VS Code theme)
│   ├── layout.js        # Root layout component
│   └── page.js          # Main page component
├── next.config.js       # Next.js configuration for static export
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Customization

- **File structure**: Edit the file tree structure in `app/page.js`
- **Themes**: Modify theme colors in `app/globals.css`
- **Content**: Add new file content in the `sampleContent` object
- **Styling**: All VS Code authentic styling is in `app/globals.css`

## Technologies Used

- **Next.js 14** - React framework
- **React 18** - UI library
- **CSS Custom Properties** - Theme system
- **Font Awesome 6** - Icons
- **Vercel** - Deployment platform

## License

This project is open source and available under the [MIT License](LICENSE). 