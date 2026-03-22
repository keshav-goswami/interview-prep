import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  selector: 'app-topic-card',
  standalone: true,
  imports: [RouterLink, ProgressBarComponent],
  template: `
    <a [routerLink]="link" class="card topic-card">
      <div class="topic-header">
        <span class="topic-icon">{{ icon }}</span>
        <div class="topic-info">
          <h3>{{ title }}</h3>
          @if (subtitle) {
            <p class="subtitle">{{ subtitle }}</p>
          }
        </div>
        @if (badgeText) {
          <span class="topic-badge" [class]="'badge badge-' + badgeType">{{ badgeText }}</span>
        }
      </div>
      @if (showProgress) {
        <div class="topic-progress">
          <app-progress-bar [percentage]="progress" height="6px" [showLabel]="true" />
        </div>
      }
      @if (detail) {
        <p class="topic-detail">{{ detail }}</p>
      }
    </a>
  `,
  styles: [`
    .topic-card {
      display: block;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }
    .topic-card:hover { text-decoration: none; }
    .topic-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .topic-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-primary-light);
      border-radius: var(--radius-sm);
      flex-shrink: 0;
    }
    .topic-info { flex: 1; min-width: 0; }
    .topic-info h3 {
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .subtitle {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
    }
    .topic-badge { margin-left: auto; flex-shrink: 0; }
    .topic-progress { margin-top: 14px; }
    .topic-detail {
      margin-top: 10px;
      font-size: 0.82rem;
      color: var(--color-text-secondary);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class TopicCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() link = '';
  @Input() progress = 0;
  @Input() showProgress = true;
  @Input() badgeText = '';
  @Input() badgeType = '';
  @Input() detail = '';
}
