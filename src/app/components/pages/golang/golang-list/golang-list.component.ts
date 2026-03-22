import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressService } from '../../../../services/progress.service';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { GOLANG_TOPICS } from '../../../../data/golang-topics.data';
import { GolangTopic, GolangCategory } from '../../../../models/golang.model';

interface CategoryGroup {
  category: GolangCategory;
  label: string;
  icon: string;
  topics: GolangTopic[];
}

@Component({
  selector: 'app-golang-list',
  standalone: true,
  imports: [RouterLink, ProgressBarComponent],
  template: `
    <div class="golang-list-page">
      <div class="section-header">
        <div>
          <h1>Golang</h1>
          <p class="page-subtitle">{{ allTopics.length }} topics</p>
        </div>
      </div>

      <div class="overall-progress card-flat">
        <div class="overall-stats">
          <span class="stat-completed">{{ completedCount() }} completed</span>
          <span class="stat-total">of {{ allTopics.length }} topics</span>
        </div>
        <app-progress-bar
          [percentage]="overallPercentage()"
          height="10px"
          [showLabel]="true"
        />
      </div>

      <!-- Search -->
      <div class="search-wrapper">
        <input
          type="text"
          class="search-input"
          placeholder="Search Go topics..."
          [value]="searchQuery()"
          (input)="onSearch($event)"
        />
      </div>

      <!-- Category groups -->
      @for (group of filteredGroups(); track group.category) {
        <section class="category-section">
          <h2 class="category-header">
            <span class="category-icon">{{ group.icon }}</span>
            {{ group.label }}
          </h2>
          <div class="grid-4">
            @for (topic of group.topics; track topic.id) {
              <a [routerLink]="'/golang/' + topic.id" class="card topic-card">
                <div class="topic-top">
                  <h3 class="topic-name">{{ topic.title }}</h3>
                  <span class="tag category-tag">{{ group.label }}</span>
                </div>
                <div class="topic-footer">
                  <span class="tag status-tag" [class]="'tag-' + getStatus(topic.id)">
                    {{ formatStatus(getStatus(topic.id)) }}
                  </span>
                </div>
              </a>
            }
          </div>
        </section>
      }

      @if (filteredGroups().length === 0) {
        <div class="empty-state">
          <p>No topics match "{{ searchQuery() }}"</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .golang-list-page { max-width: 1200px; }
    .page-subtitle {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      margin-top: 4px;
    }
    .overall-progress { margin-bottom: 24px; }
    .overall-stats {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }
    .stat-completed {
      font-weight: 600;
      color: var(--color-success);
      font-size: 0.95rem;
    }
    .stat-total {
      font-size: 0.85rem;
      color: var(--color-text-muted);
    }
    .search-wrapper { margin-bottom: 28px; }
    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 10px 16px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-surface);
      color: var(--color-text);
      font-size: 0.9rem;
      font-family: var(--font-sans);
      transition: border-color var(--transition);
      outline: none;
    }
    .search-input::placeholder { color: var(--color-text-muted); }
    .search-input:focus { border-color: var(--color-primary); }
    .category-section { margin-bottom: 32px; }
    .category-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--color-border);
      color: var(--color-text);
      font-size: 1.1rem;
    }
    .category-icon { font-size: 1.2rem; }
    .topic-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }
    .topic-card:hover { text-decoration: none; }
    .topic-top {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .topic-name {
      font-size: 0.95rem;
      font-weight: 600;
    }
    .category-tag {
      background: var(--color-primary-light);
      color: var(--color-primary);
      align-self: flex-start;
    }
    .topic-footer {
      margin-top: auto;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .status-tag {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
    }
    .tag-not-started { background: var(--color-border-light); color: var(--color-text-muted); }
    .tag-in-progress { background: var(--color-info-light); color: var(--color-info); }
    .tag-completed { background: var(--color-success-light); color: var(--color-success); }
    .tag-needs-review { background: var(--color-warning-light); color: var(--color-warning); }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: var(--color-text-muted);
    }
  `]
})
export class GolangListComponent implements OnInit {
  private progressService = inject(ProgressService);

  allTopics = GOLANG_TOPICS;

  searchQuery = signal('');
  filteredGroups = signal<CategoryGroup[]>([]);
  completedCount = signal(0);
  overallPercentage = signal(0);

  private categoryMeta: Record<GolangCategory, { label: string; icon: string }> = {
    'fundamentals': { label: 'Fundamentals', icon: '\u{1F4E6}' },
    'concurrency': { label: 'Concurrency', icon: '\u26A1' },
    'orm': { label: 'ORM (GORM)', icon: '\u{1F5C4}' },
    'patterns': { label: 'Patterns & Best Practices', icon: '\u{1F3D7}' },
    'testing': { label: 'Testing', icon: '\u{1F9EA}' },
    'performance': { label: 'Performance', icon: '\u{1F680}' }
  };

  private categoryOrder: GolangCategory[] = ['fundamentals', 'concurrency', 'orm', 'patterns', 'testing', 'performance'];

  ngOnInit(): void {
    this.initializeProgress();
    this.updateGroups();
    this.updateOverallProgress();
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.updateGroups();
  }

  getStatus(topicId: string): string {
    return this.progressService.getItemStatus('golang', topicId, '_topic');
  }

  formatStatus(status: string): string {
    return status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  private initializeProgress(): void {
    const items = this.allTopics.map(t => ({ topicId: t.id, itemId: '_topic' }));
    this.progressService.initializeItems('golang', items);
  }

  private updateOverallProgress(): void {
    let completed = 0;
    for (const topic of this.allTopics) {
      if (this.progressService.getItemStatus('golang', topic.id, '_topic') === 'completed') {
        completed++;
      }
    }
    this.completedCount.set(completed);
    this.overallPercentage.set(
      this.allTopics.length > 0 ? Math.round((completed / this.allTopics.length) * 100) : 0
    );
  }

  private updateGroups(): void {
    const query = this.searchQuery().toLowerCase().trim();

    const groups: CategoryGroup[] = [];

    for (const cat of this.categoryOrder) {
      let topics = this.allTopics.filter(t => t.category === cat);

      if (query) {
        topics = topics.filter(t =>
          t.title.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
        );
      }

      if (topics.length > 0) {
        const meta = this.categoryMeta[cat];
        groups.push({
          category: cat,
          label: meta.label,
          icon: meta.icon,
          topics: topics.sort((a, b) => a.order - b.order)
        });
      }
    }

    this.filteredGroups.set(groups);
  }
}
