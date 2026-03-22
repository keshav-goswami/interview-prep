import { Component, Input } from '@angular/core';
import { ExternalLink } from '../../../models/dsa.model';

@Component({
  selector: 'app-external-link',
  standalone: true,
  template: `
    <a [href]="link.url" target="_blank" rel="noopener" class="ext-link" [title]="link.label">
      <span class="ext-icon">{{ getIcon(link.label) }}</span>
      {{ link.label }}
    </a>
  `,
  styles: [`
    .ext-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: all var(--transition);
    }
    .ext-link:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      text-decoration: none;
    }
    .ext-icon { font-size: 0.9rem; }
  `]
})
export class ExternalLinkComponent {
  @Input() link!: ExternalLink;

  getIcon(label: string): string {
    const icons: Record<string, string> = {
      'LeetCode': '🟡',
      'NeetCode': '🟢',
      'GFG': '🟢',
      'HelloInterview': '👋',
      'ByteByteGo': '📺',
      'YouTube': '▶',
    };
    return icons[label] || '🔗';
  }
}
