import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'angular19-tailwind-gsap-swiper';
  mobileMenuOpen = false;
  
  constructor() {}
  
  ngOnInit() {
    // 初始化代碼
  }
  
  ngAfterViewInit() {
    // 初始化 GSAP 動畫
    this.initAnimations();
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
  initAnimations() {
    // 頂部導航動畫
    gsap.from('nav', {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }
}