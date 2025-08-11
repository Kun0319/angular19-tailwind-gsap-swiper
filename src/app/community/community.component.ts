import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen py-12 px-4">
      <h1 class="text-3xl font-bold text-center text-white mb-8">線上社區</h1>
      <div class="max-w-4xl mx-auto bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-lg">
        <p class="text-gray-300 mb-4">此頁面正在建設中，敬請期待完整的社區互動功能。</p>
      </div>
    </div>
  `,
  styles: ``
})
export class CommunityComponent {}