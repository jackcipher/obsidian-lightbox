# Obsidian Lightbox

一个为 Obsidian 打造的 Lightbox 插件，支持点击放大图片和 Mermaid 图表。

## 功能特性

- 🖼️ **图片放大** - 点击阅读视图中的图片，弹出 Lightbox 查看大图
- 📊 **Mermaid 支持** - 点击 Mermaid 图表也能放大查看
- 🔍 **缩放控制** - 支持放大、缩小、重置缩放比例
- 🖱️ **滚轮缩放** - 使用鼠标滚轮快速调整缩放
- ✋ **拖拽移动** - 放大后可拖拽查看图片不同区域
- ⌨️ **快捷键** - 按 ESC 快速关闭
- 🎨 **优雅动画** - 平滑的打开/关闭动画效果

## 安装

### 手动安装

1. 下载最新的 release
2. 解压到 Obsidian 插件目录: `<vault>/.obsidian/plugins/obsidian-lightbox/`
3. 重启 Obsidian
4. 在设置中启用插件

### 从源码构建

```bash
# 克隆仓库
cd <vault>/.obsidian/plugins/
git clone https://github.com/your-repo/obsidian-lightbox.git
cd obsidian-lightbox

# 安装依赖
npm install

# 构建
npm run build
```

## 使用方法

1. 在 Obsidian 中打开任意包含图片或 Mermaid 图表的笔记
2. 切换到**阅读视图** (Reading View)
3. 点击任意图片或 Mermaid 图表
4. Lightbox 弹窗会显示放大的内容

### 控制方式

| 操作 | 说明 |
|------|------|
| 点击图片/Mermaid | 打开 Lightbox |
| 滚轮上滚 | 放大 |
| 滚轮下滚 | 缩小 |
| 鼠标拖拽 | 移动图片位置 |
| 点击背景 | 关闭 Lightbox |
| ESC 键 | 关闭 Lightbox |
| ➕ 按钮 | 放大 25% |
| ➖ 按钮 | 缩小 25% |
| 🔄 按钮 | 重置缩放和位置 |
| ✖️ 按钮 | 关闭 |

## 开发

```bash
# 开发模式（自动重新构建）
npm run dev

# 生产构建
npm run build
```

## License

MIT

