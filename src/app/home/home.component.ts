import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('swiperContainer') swiperContainer!: ElementRef;
    @ViewChild('newsContainer', {static: false}) newsContainer?: ElementRef;

    private swiper!: Swiper;
    private currentTimeline: gsap.core.Timeline | null = null;

    // 當前頁索引
    currentPage = 0;
    totalPages = 5;

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        console.log('Component initialized');
        // 暫時不隱藏滾動，方便調試
        // if (!document.body.classList.contains('graffiti-mode-active')) {
        //   document.body.style.overflow = 'hidden';
        // }
    }

    ngAfterViewInit(): void {
        console.log('AfterViewInit called');
        // 增加延遲確保 DOM 完全載入
        setTimeout(() => {
            console.log('Checking swiper container:', this.swiperContainer);
            if (this.swiperContainer?.nativeElement) {
                console.log('Swiper container found, initializing...');
                console.log('Container element:', this.swiperContainer.nativeElement);
                this.initSwiper();
                // 暫時簡化初始動畫
                setTimeout(() => {
                    this.animateCurrentPage(0);
                }, 1000);
            } else {
                console.error('Swiper container not found!');
            }
        }, 1000);
    }

    ngOnDestroy(): void {
        console.log('Component destroying');
        if (this.currentTimeline) {
            this.currentTimeline.kill();
        }

        if (this.swiper) {
            this.swiper.destroy(true, true);
        }

        document.body.style.overflow = '';
    }

    // 簡化的 Swiper 初始化
    initSwiper(): void {
        try {
            console.log('Starting Swiper initialization...');

            // 檢查容器
            const container = this.swiperContainer.nativeElement;
            console.log('Container classList:', container.classList);
            console.log('Container children:', container.children);

            this.swiper = new Swiper(container, {
                direction: 'horizontal',  // 改為橫向滾動！
                modules: [Pagination, Mousewheel, Keyboard],

                width: window.innerWidth,   // 使用寬度
                speed: 800,

                // 簡化配置
                mousewheel: {
                    enabled: true,
                    sensitivity: 1,
                },

                keyboard: {
                    enabled: true,
                },

                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet',
                    bulletActiveClass: 'swiper-pagination-bullet-active',
                },

                // 調試回調
                on: {
                    init: (swiper) => {
                        console.log('Horizontal Swiper initialized successfully!');
                        console.log('Swiper slides:', swiper.slides.length);
                        console.log('Swiper wrapper:', swiper.wrapperEl);

                        // 確保第一頁可見
                        setTimeout(() => {
                            this.animateCurrentPage(0);
                        }, 100);
                    },

                    slideChange: (swiper) => {
                        console.log('Slide changed to:', swiper.activeIndex);
                        this.currentPage = swiper.activeIndex;
                        this.animateCurrentPage(swiper.activeIndex);
                    },

                    resize: () => {
                        console.log('Swiper resize event');
                        if (this.swiper) {
                            this.swiper.update();
                        }
                    },
                },
            });

            console.log('Swiper created:', this.swiper);

        } catch (error) {
            console.error('Error initializing Swiper:', error);
        }
    }

    // 簡化的動畫
    animateCurrentPage(index: number): void {
        console.log(`Animating page ${index}`);

        // 清理之前的動畫
        if (this.currentTimeline) {
            this.currentTimeline.kill()
        }

        // 確保當前頁面可見
        const slides = document.querySelectorAll('.swiper-slide');
        slides.forEach((slide, i) => {
            if (i === index) {
                gsap.set(slide, {
                    opacity: 1,
                    visibility: 'visible',
                });
            }
        });

        // 執行對應的動畫
        switch (index) {
            case 0:
                this.animateHeroSection();
                break;
            case 1:
                this.animateFeatureSection();
                break;
            case 2:
                this.animateStatsSection();
                break;
            case 3:
                this.animateNewsSection();
                break;
            case 4:
                this.animateContactSection();
                break;
        }
    }

    // 簡潔版英雄區塊動畫
    animateHeroSection(): void {
        console.log('Animating hero section with clean animations');

        const tl = gsap.timeline();
        this.currentTimeline = tl;

        // 1. 導航欄 - 簡單淡入
        tl.fromTo('nav',
            { y: -30, opacity: 0 },
            { 
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out'
            }
        );

        // 2. 內容區塊 - 淡入上升
        tl.fromTo('.section-hero .bg-white',
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out'
            }, 0.2
        );

        // 3. 卡片 - 簡單交錯淡入
        tl.fromTo('.section-hero .bg-slate-800',
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power1.out'
            }, 0.4
        );

        // 4. 底部連結 - 淡入
        tl.fromTo('.section-hero .text-gray-300',
            { opacity: 0 },
            {
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power1.out'
            }, 0.8
        );
    }

    // 簡潔版特色區塊動畫
    animateFeatureSection(): void {
        console.log('Animating features section with clean effects');

        const tl = gsap.timeline();
        this.currentTimeline = tl;

        const title = document.querySelector('.section-features h2');
        const cards = document.querySelectorAll('.feature-card');

        // 1. 標題 - 簡單淡入
        if (title) {
            tl.fromTo(title,
                { y: 30, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out'
                }
            );
        }

        // 2. 卡片 - 交錯淡入上升
        if (cards.length > 0) {
            tl.fromTo(cards,
                { y: 40, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power2.out'
                }, 0.2
            );

            // 3. 簡潔的懸停效果
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -8,
                        scale: 1.02,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            });
        }
    }

    // 簡潔版統計區塊動畫
    animateStatsSection(): void {
        console.log('Animating stats section with clean counters');

        const tl = gsap.timeline();
        this.currentTimeline = tl;

        const title = document.querySelector('.section-stats h2');
        const cards = document.querySelectorAll('.section-stats .bg-gray-800');
        const counters = document.querySelectorAll('.section-stats .counter');

        // 1. 標題 - 簡單淡入
        if (title) {
            tl.fromTo(title,
                { y: 30, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.6,
                    ease: 'power2.out'
                }
            );
        }

        // 2. 卡片 - 交錯淡入上升
        if (cards.length > 0) {
            tl.fromTo(cards,
                { y: 40, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out'
                }, 0.2
            );
        }

        // 3. 簡潔的數字計數動畫
        if (counters.length > 0) {
            counters.forEach((counter, i) => {
                const target = +(counter.getAttribute('data-target') || '0');
                const obj = { value: 0 };

                tl.to(obj, {
                    value: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: function() {
                        const currentValue = Math.floor(obj.value);
                        
                        // 格式化數字顯示
                        let displayValue = '';
                        if (target >= 1000000) {
                            displayValue = (currentValue / 1000000).toFixed(1).replace('.0', '') + 'M';
                        } else if (target >= 1000) {
                            displayValue = (currentValue / 1000).toFixed(0) + 'K';
                        } else {
                            displayValue = currentValue.toString();
                        }
                        
                        counter.textContent = displayValue;
                    }
                }, 0.6 + (i * 0.1));
            });
        }
    }

    // 簡潔版新聞區塊動畫
    animateNewsSection(): void {
        console.log('Animating news section with clean effects');

        const tl = gsap.timeline();
        this.currentTimeline = tl;

        const title = document.querySelector('.section-news h2');
        const newsItems = document.querySelectorAll('#newsContainer > div');

        // 1. 標題 - 簡單淡入
        if (title) {
            tl.fromTo(title,
                { y: 30, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out'
                }
            );
        }

        // 2. 新聞卡片 - 交錯淡入
        if (newsItems.length > 0) {
            tl.fromTo(newsItems,
                { y: 40, opacity: 0 },
                { 
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power2.out'
                }, 0.2
            );

            // 簡潔的懸停效果
            newsItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    gsap.to(item, {
                        y: -5,
                        scale: 1.02,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });

                item.addEventListener('mouseleave', () => {
                    gsap.to(item, {
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            });
        }
    }

    // 簡潔版聯繫區塊動畫
    animateContactSection(): void {
        console.log('Animating contact section with clean effects');

        const tl = gsap.timeline();
        this.currentTimeline = tl;

        const title = document.querySelector('.section-contact h2');
        const contactBox = document.querySelector('.section-contact .bg-gray-800');
        const inputs = document.querySelectorAll('.section-contact input, .section-contact textarea');

        // 1. 標題 - 簡單淡入
        if (title) {
            tl.fromTo(title,
                { y: 30, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.6,
                    ease: 'power2.out'
                }
            );
        }

        // 2. 聯繫框 - 淡入上升
        if (contactBox) {
            tl.fromTo(contactBox,
                { y: 40, opacity: 0 },
                { 
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out'
                }, 0.2
            );
        }

        // 3. 表單元素 - 交錯淡入
        if (inputs.length > 0) {
            tl.fromTo(inputs,
                { y: 20, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out'
                }, 0.4
            );

            // 簡潔的聚焦效果  
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    gsap.to(input, {
                        scale: 1.01,
                        duration: 0.2,
                        ease: 'power2.out'
                    });
                });

                input.addEventListener('blur', () => {
                    gsap.to(input, {
                        scale: 1,
                        duration: 0.2,
                        ease: 'power2.out'
                    });
                });
            });
        }
    }

    // 公開方法
    goToSlide(index: number): void {
        if (this.swiper && index >= 0 && index < this.totalPages) {
            this.swiper.slideTo(index);
        }
    }

    nextSlide(): void {
        if (this.swiper) {
            this.swiper.slideNext();
        }
    }

    prevSlide(): void {
        if (this.swiper) {
            this.swiper.slidePrev();
        }
    }
}