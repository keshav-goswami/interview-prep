import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'interview-prep-theme';
  isDark = signal<boolean>(this.loadTheme());

  constructor() {
    this.applyTheme();
  }

  toggle(): void {
    this.isDark.set(!this.isDark());
    this.applyTheme();
    localStorage.setItem(this.THEME_KEY, this.isDark() ? 'dark' : 'light');
  }

  private loadTheme(): boolean {
    const saved = localStorage.getItem(this.THEME_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.isDark() ? 'dark' : 'light');
  }
}
