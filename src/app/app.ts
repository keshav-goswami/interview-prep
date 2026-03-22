import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="app-layout">
      <app-sidebar />
      <div class="main-area" [style.margin-left]="profileService.isCollapsed() ? '60px' : 'var(--sidebar-width)'">
        <app-header />
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
    }
    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      transition: margin-left 0.25s ease;
    }
    .content {
      flex: 1;
      padding: 28px 32px;
      max-width: 1200px;
    }
  `]
})
export class App {
  profileService = inject(ProfileService);
}
