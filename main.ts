import { Plugin, MarkdownView, setIcon } from 'obsidian';

interface LightboxSettings {
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
}

const DEFAULT_SETTINGS: LightboxSettings = {
  minZoom: 0.5,
  maxZoom: 5,
  zoomStep: 0.25
};

export default class LightboxPlugin extends Plugin {
  settings: LightboxSettings = DEFAULT_SETTINGS;
  private lightboxEl: HTMLElement | null = null;
  private currentZoom: number = 1;
  private isDragging: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private translateX: number = 0;
  private translateY: number = 0;
  private contentEl: HTMLElement | null = null;

  async onload() {
    await this.loadSettings();

    // 注册点击事件监听器
    this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
      const target = evt.target as HTMLElement;
      
      // 检查是否点击了图片
      if (target.tagName === 'IMG' && this.isInReadingView(target)) {
        evt.preventDefault();
        evt.stopPropagation();
        this.openLightbox(target as HTMLImageElement);
        return;
      }

      // 检查是否点击了 mermaid 图表
      const mermaidEl = target.closest('.mermaid') as HTMLElement;
      if (mermaidEl && this.isInReadingView(mermaidEl)) {
        evt.preventDefault();
        evt.stopPropagation();
        this.openMermaidLightbox(mermaidEl);
        return;
      }
    });

    // 注册键盘事件（ESC 关闭）
    this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
      if (evt.key === 'Escape' && this.lightboxEl) {
        this.closeLightbox();
      }
    });
  }

  onunload() {
    this.closeLightbox();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  private isInReadingView(el: HTMLElement): boolean {
    // 检查元素是否在阅读视图中
    const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!markdownView) return false;
    
    const previewEl = markdownView.containerEl.querySelector('.markdown-reading-view');
    if (!previewEl) return false;
    
    return previewEl.contains(el);
  }

  private openLightbox(img: HTMLImageElement) {
    this.createLightboxContainer();
    
    const contentWrapper = this.lightboxEl!.querySelector('.lightbox-content-wrapper') as HTMLElement;
    
    // 创建图片元素
    const imgClone = document.createElement('img');
    imgClone.src = img.src;
    imgClone.alt = img.alt || '';
    imgClone.className = 'lightbox-image';
    
    contentWrapper.appendChild(imgClone);
    this.contentEl = imgClone;
    
    this.resetZoom();
    this.setupDragHandlers(contentWrapper);
  }

  private openMermaidLightbox(mermaidEl: HTMLElement) {
    this.createLightboxContainer();
    
    const contentWrapper = this.lightboxEl!.querySelector('.lightbox-content-wrapper') as HTMLElement;
    
    // 克隆 mermaid SVG
    const svg = mermaidEl.querySelector('svg');
    if (svg) {
      const svgClone = svg.cloneNode(true) as SVGElement;
      svgClone.classList.add('lightbox-mermaid');
      
      svgClone.classList.add('lightbox-mermaid-content');
      
      contentWrapper.appendChild(svgClone);
      this.contentEl = svgClone as unknown as HTMLElement;
    }
    
    this.resetZoom();
    this.setupDragHandlers(contentWrapper);
  }

  private createLightboxContainer() {
    // 如果已存在，先关闭
    if (this.lightboxEl) {
      this.closeLightbox();
    }

    // 创建 lightbox 容器
    this.lightboxEl = document.createElement('div');
    this.lightboxEl.className = 'lightbox-overlay';
    
    // 创建内容包装器
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'lightbox-content-wrapper';
    
    // 创建控制栏
    const controls = document.createElement('div');
    controls.className = 'lightbox-controls';
    
    // 缩小按钮
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = 'lightbox-btn';
    setIcon(zoomOutBtn, 'zoom-out');
    zoomOutBtn.title = '缩小';
    zoomOutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.zoomOut();
    });
    
    // 缩放显示
    const zoomDisplay = document.createElement('span');
    zoomDisplay.className = 'lightbox-zoom-display';
    zoomDisplay.textContent = '100%';
    
    // 放大按钮
    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = 'lightbox-btn';
    setIcon(zoomInBtn, 'zoom-in');
    zoomInBtn.title = '放大';
    zoomInBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.zoomIn();
    });
    
    // 重置按钮
    const resetBtn = document.createElement('button');
    resetBtn.className = 'lightbox-btn';
    setIcon(resetBtn, 'rotate-ccw');
    resetBtn.title = '重置';
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.resetZoom();
    });
    
    // 关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-btn lightbox-close-btn';
    setIcon(closeBtn, 'x');
    closeBtn.title = '关闭 (Esc)';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeLightbox();
    });
    
    controls.appendChild(zoomOutBtn);
    controls.appendChild(zoomDisplay);
    controls.appendChild(zoomInBtn);
    controls.appendChild(resetBtn);
    controls.appendChild(closeBtn);
    
    this.lightboxEl.appendChild(contentWrapper);
    this.lightboxEl.appendChild(controls);
    
    // 点击背景关闭
    this.lightboxEl.addEventListener('click', (e) => {
      if (e.target === this.lightboxEl) {
        this.closeLightbox();
      }
    });
    
    // 滚轮缩放
    this.lightboxEl.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    }, { passive: false });
    
    document.body.appendChild(this.lightboxEl);
    
    // 添加打开动画
    requestAnimationFrame(() => {
      this.lightboxEl?.classList.add('lightbox-active');
    });
  }

  private setupDragHandlers(wrapper: HTMLElement) {
    wrapper.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // 只响应左键
      this.isDragging = true;
      this.startX = e.clientX - this.translateX;
      this.startY = e.clientY - this.translateY;
      wrapper.setCssStyles({ cursor: 'grabbing' });
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      this.translateX = e.clientX - this.startX;
      this.translateY = e.clientY - this.startY;
      this.updateTransform();
    });

    document.addEventListener('mouseup', () => {
      this.isDragging = false;
      if (wrapper) {
        wrapper.setCssStyles({ cursor: 'grab' });
      }
    });
  }

  private closeLightbox() {
    if (this.lightboxEl) {
      this.lightboxEl.classList.remove('lightbox-active');
      setTimeout(() => {
        this.lightboxEl?.remove();
        this.lightboxEl = null;
        this.contentEl = null;
      }, 200);
    }
    this.resetState();
  }

  private resetState() {
    this.currentZoom = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.isDragging = false;
  }

  private zoomIn() {
    const newZoom = Math.min(this.currentZoom + this.settings.zoomStep, this.settings.maxZoom);
    this.setZoom(newZoom);
  }

  private zoomOut() {
    const newZoom = Math.max(this.currentZoom - this.settings.zoomStep, this.settings.minZoom);
    this.setZoom(newZoom);
  }

  private resetZoom() {
    this.currentZoom = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.updateTransform();
    this.updateZoomDisplay();
  }

  private setZoom(zoom: number) {
    this.currentZoom = zoom;
    this.updateTransform();
    this.updateZoomDisplay();
  }

  private updateTransform() {
    if (this.contentEl) {
      this.contentEl.setCssStyles({
        transform: `translate(${this.translateX}px, ${this.translateY}px) scale(${this.currentZoom})`
      });
    }
  }

  private updateZoomDisplay() {
    if (this.lightboxEl) {
      const display = this.lightboxEl.querySelector('.lightbox-zoom-display');
      if (display) {
        display.textContent = `${Math.round(this.currentZoom * 100)}%`;
      }
    }
  }
}

