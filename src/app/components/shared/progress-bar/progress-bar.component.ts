import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  template: `
    <div class="progress-track" [style.height]="height">
      <div class="progress-fill"
           [style.width.%]="percentage"
           [style.background]="color">
      </div>
    </div>
    @if (showLabel) {
      <span class="progress-label">{{ percentage }}%</span>
    }
  `,
  styles: [`
    :host { display: flex; align-items: center; gap: 8px; }
    .progress-track {
      flex: 1;
      background: var(--color-border);
      border-radius: 20px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 20px;
      transition: width 0.4s ease;
      min-width: 0;
    }
    .progress-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      min-width: 36px;
      text-align: right;
    }
  `]
})
export class ProgressBarComponent {
  @Input() percentage = 0;
  @Input() color = 'var(--color-primary)';
  @Input() height = '8px';
  @Input() showLabel = true;
}
