import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GameInfoComponent } from './game-info/game-info.component';
import { CharactersComponent } from './characters/characters.component';
import { NewsComponent } from './news/news.component';
import { CommunityComponent } from './community/community.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game-info', component: GameInfoComponent },
  { path: 'characters', component: CharactersComponent },
  { path: 'news', component: NewsComponent },
  { path: 'community', component: CommunityComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // 重定向到首頁
];