import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraffitiService {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private drawing = false;
  private lastX = 0;
  private lastY = 0;
  
  constructor() { }
  
  // 初始化塗鴉畫布
  initCanvas(): HTMLCanvasElement {
    if (this.canvas) {
      document.body.removeChild(this.canvas);
    }
    
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'graffiti-canvas';
    this.canvas.classList.add('graffiti-canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '5'; // 降低畫布的 z-index
    this.canvas.style.pointerEvents = 'auto';
    
    // 為了解決問題，我們把滑鼠事件分配到畫布下，讓所有UI元素在畫布上面
    this.canvas.style.pointerEvents = 'none';
    
    this.ctx = this.canvas.getContext('2d');
    if (this.ctx) {
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineJoin = 'round';
      this.ctx.lineCap = 'round';
      this.ctx.lineWidth = 5;
    }
    
    // 添加一個專用的繪畫層
    const drawLayer = document.createElement('div');
    drawLayer.id = 'graffiti-draw-layer';
    drawLayer.style.position = 'fixed';
    drawLayer.style.top = '0';
    drawLayer.style.left = '0';
    drawLayer.style.width = '100vw';
    drawLayer.style.height = '100vh';
    drawLayer.style.zIndex = '4'; // 在畫布下
    drawLayer.style.pointerEvents = 'auto';
    
    // 添加事件監聽器到繪畫層
    drawLayer.addEventListener('mousedown', this.startDrawing.bind(this));
    drawLayer.addEventListener('mousemove', this.draw.bind(this));
    drawLayer.addEventListener('mouseup', this.stopDrawing.bind(this));
    drawLayer.addEventListener('mouseout', this.stopDrawing.bind(this));
    
    // 觸控支援
    drawLayer.addEventListener('touchstart', this.handleTouchStart.bind(this));
    drawLayer.addEventListener('touchmove', this.handleTouchMove.bind(this));
    drawLayer.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // 添加到 DOM
    document.body.appendChild(this.canvas);
    document.body.appendChild(drawLayer);
    
    // 設置窗口大小變化時的重置
    window.addEventListener('resize', this.handleResize.bind(this));
    
    return this.canvas;
  }
  
  // 處理窗口大小變化
  private handleResize(): void {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      // 重設繪畫樣式
      if (this.ctx) {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5;
      }
    }
  }
  
  // 開始繪畫
  private startDrawing(e: MouseEvent): void {
    // 檢查是否點擊了UI元素
    const target = e.target as HTMLElement;
    if (this.shouldIgnoreDrawing(target, e.clientX, e.clientY)) {
      return;
    }
    
    this.drawing = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }
  
  // 繪畫
  private draw(e: MouseEvent): void {
    if (!this.drawing || !this.ctx || !this.canvas) return;
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    // 如果滑鼠移動到UI元素上，暫停繪畫
    const target = e.target as HTMLElement;
    if (this.shouldIgnoreDrawing(target, currentX, currentY)) {
      return;
    }
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();
    
    this.lastX = currentX;
    this.lastY = currentY;
  }
  
  // 停止繪畫
  private stopDrawing(): void {
    this.drawing = false;
  }
  
  // 處理觸控開始
  private handleTouchStart(e: TouchEvent): void {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
    
    // 檢查是否點擊了UI元素
    if (this.shouldIgnoreDrawing(target, touch.clientX, touch.clientY)) {
      return;
    }
    
    this.lastX = touch.clientX;
    this.lastY = touch.clientY;
    this.drawing = true;
  }
  
  // 處理觸控移動
  private handleTouchMove(e: TouchEvent): void {
    if (!this.drawing || !this.ctx || !this.canvas || e.touches.length !== 1) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;
    
    // 如果觸控移動到UI元素上，暫停繪畫
    const target = document.elementFromPoint(currentX, currentY) as HTMLElement;
    if (this.shouldIgnoreDrawing(target, currentX, currentY)) {
      return;
    }
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();
    
    this.lastX = currentX;
    this.lastY = currentY;
  }
  
  // 處理觸控結束
  private handleTouchEnd(e: TouchEvent): void {
    e.preventDefault();
    this.drawing = false;
  }
  
  // 判斷是否應該忽略在特定元素上的繪畫
  private shouldIgnoreDrawing(target: HTMLElement, x: number, y: number): boolean {
    // 檢查點擊位置是否在UI元素上
    const elementsAtPoint = document.elementsFromPoint(x, y);
    
    // 檢查是否有互動元素
    for (const el of elementsAtPoint) {
      const element = el as HTMLElement;
      // 檢查是否為UI元素 (左側面板、導航、按鈕等)
      if (
        element.closest('.section-hero .bg-white') || 
        element.closest('.section-hero .bg-slate-800') ||
        element.closest('.navigation-dots') ||
        element.closest('.nav-dot') ||
        element.closest('nav') ||
        element.closest('button') ||
        element.closest('a') ||
        element.closest('input') ||
        element.closest('textarea') ||
        element.closest('.sticker-selector') || // 貼紙選擇器
        element.closest('.modal') || 
        element.closest('.dialog') ||
        element.closest('.popup') ||
        element.id === 'graffiti-toggle' ||
        element.tagName.toLowerCase() === 'button' ||
        element.tagName.toLowerCase() === 'a' ||
        element.tagName.toLowerCase() === 'input' ||
        element.tagName.toLowerCase() === 'select' ||
        (
          element.id !== 'graffiti-canvas' && 
          element.id !== 'graffiti-draw-layer' && 
          element.getAttribute('role') === 'button'
        )
      ) {
        return true; // 忽略繪畫
      }
    }
    
    return false;
  }
  
  // 清除畫布
  clearCanvas(): void {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  
  // 設置筆刷顏色
  setBrushColor(color: string): void {
    if (this.ctx) {
      this.ctx.strokeStyle = color;
    }
  }
  
  // 設置筆刷大小
  setBrushSize(size: number): void {
    if (this.ctx) {
      this.ctx.lineWidth = size;
    }
  }
  
  // 禁用塗鴉畫布
  disableCanvas(): void {
    if (this.canvas) {
      const drawLayer = document.getElementById('graffiti-draw-layer');
      if (drawLayer) {
        document.body.removeChild(drawLayer);
      }
      
      document.body.removeChild(this.canvas);
      this.canvas = null;
      this.ctx = null;
      
      // 移除窗口大小變化監聽
      window.removeEventListener('resize', this.handleResize.bind(this));
    }
  }
  
  // 檢查元素是否為UI元素
  isUIElement(element: HTMLElement): boolean {
    return !!element.closest('.section-hero .bg-white') || 
           !!element.closest('.section-hero .bg-slate-800') ||
           !!element.closest('.navigation-dots') ||
           !!element.closest('nav') ||
           !!element.closest('button') ||
           !!element.closest('a') ||
           !!element.closest('input') ||
           !!element.closest('.sticker-selector') || // 貼紙選擇器
           !!element.closest('.modal') || 
           !!element.closest('.dialog') ||
           !!element.closest('.popup') ||
           element.id === 'graffiti-toggle' ||
           element.tagName.toLowerCase() === 'button' ||
           element.tagName.toLowerCase() === 'a' ||
           element.tagName.toLowerCase() === 'input' ||
           element.tagName.toLowerCase() === 'select' ||
           element.getAttribute('role') === 'button';
  }
}
