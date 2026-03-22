import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ItemStatus } from '../../../models/progress.model';
import { StatusLabelPipe } from '../../../pipes/status-label.pipe';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [StatusLabelPipe],
  template: `
    <button class="status-badge" [class]="'status-' + status" (click)="onClick()" [title]="'Click to change status'">
      {{ status | statusLabel }}
    </button>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all var(--transition);
      white-space: nowrap;
    }
    .status-badge:hover { opacity: 0.85; transform: scale(1.02); }
    .status-not-started {
      background: var(--color-border-light);
      color: var(--color-text-muted);
    }
    .status-in-progress {
      background: var(--color-info-light);
      color: var(--color-info);
    }
    .status-completed {
      background: var(--color-success-light);
      color: var(--color-success);
    }
    .status-needs-review {
      background: var(--color-warning-light);
      color: var(--color-warning);
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status: ItemStatus = 'not-started';
  @Output() statusChange = new EventEmitter<void>();

  onClick(): void {
    this.statusChange.emit();
  }
}
