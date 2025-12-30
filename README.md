# Obsidian Lightbox

[中文文档](./README-cn.md)

A Lightbox plugin for Obsidian that allows you to click and zoom images and Mermaid diagrams.

## Features

- 🖼️ **Image Zoom** - Click images in reading view to open a Lightbox with enlarged view
- 📊 **Mermaid Support** - Click Mermaid diagrams to zoom them as well
- 🔍 **Zoom Controls** - Support for zoom in, zoom out, and reset
- 🖱️ **Scroll Zoom** - Use mouse wheel to quickly adjust zoom level
- ✋ **Drag to Pan** - Drag to view different areas when zoomed in
- ⌨️ **Keyboard Shortcut** - Press ESC to quickly close
- 🎨 **Smooth Animations** - Elegant open/close transition effects

## Installation

### Manual Installation

1. Download the latest release
2. Extract to Obsidian plugins directory: `<vault>/.obsidian/plugins/obsidian-lightbox/`
3. Restart Obsidian
4. Enable the plugin in settings

### Build from Source

```bash
# Clone the repository
cd <vault>/.obsidian/plugins/
git clone https://github.com/your-repo/obsidian-lightbox.git
cd obsidian-lightbox

# Install dependencies
npm install

# Build
npm run build
```

### Required Files

To install the plugin, you only need these 3 files in the plugin folder:

- `manifest.json` - Plugin metadata (required)
- `main.js` - Compiled plugin code (required)
- `styles.css` - Stylesheet (required)

## Usage

1. Open any note containing images or Mermaid diagrams in Obsidian
2. Switch to **Reading View**
3. Click any image or Mermaid diagram
4. The Lightbox popup will display the enlarged content

### Controls

| Action | Description |
|--------|-------------|
| Click image/Mermaid | Open Lightbox |
| Scroll up | Zoom in |
| Scroll down | Zoom out |
| Mouse drag | Pan the image |
| Click background | Close Lightbox |
| ESC key | Close Lightbox |
| ➕ button | Zoom in 25% |
| ➖ button | Zoom out 25% |
| 🔄 button | Reset zoom and position |
| ✖️ button | Close |

## Development

```bash
# Development mode (auto-rebuild on changes)
npm run dev

# Production build
npm run build
```

## License

MIT
