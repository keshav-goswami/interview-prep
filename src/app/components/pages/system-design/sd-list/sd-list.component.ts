import { Component, inject, OnInit, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProgressService } from '../../../../services/progress.service';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { SYSTEM_DESIGN_TOPICS } from '../../../../data/system-design-topics.data';
import { SystemDesignTopic, SdType } from '../../../../models/system-design.model';

interface CategoryGroup {
  category: string;
  topics: SystemDesignTopic[];
}

@Component({
  selector: 'app-sd-list',
  standalone: true,
  imports: [RouterLink, ProgressBarComponent, UpperCasePipe],
  template: `
    <div class="sd-list-page">
      <div class="section-header">
        <div>
          <h1>System Design</h1>
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

      <!-- Tab filters -->
      <div class="tab-bar">
        <button class="tab-btn" [class.active]="activeTab() === 'all'" (click)="setTab('all')">All</button>
        <button class="tab-btn" [class.active]="activeTab() === 'foundation'" (click)="setTab('foundation')">Foundations</button>
        <button class="tab-btn" [class.active]="activeTab() === 'hld'" (click)="setTab('hld')">HLD</button>
        <button class="tab-btn" [class.active]="activeTab() === 'lld'" (click)="setTab('lld')">LLD</button>
      </div>

      <!-- Search -->
      <div class="search-wrapper">
        <input
          type="text"
          class="search-input"
          placeholder="Search topics..."
          [value]="searchQuery()"
          (input)="onSearch($event)"
        />
      </div>

      <!-- Category groups -->
      @for (group of filteredGroups(); track group.category) {
        <section class="category-section">
          <h2 class="category-header">{{ group.category }}</h2>
          <div class="grid-4">
            @for (topic of group.topics; track topic.id) {
              <a [routerLink]="'/system-design/' + topic.id" class="card topic-card">
                <div class="topic-top">
                  <h3 class="topic-name">{{ topic.title }}</h3>
                  <span class="badge" [class.badge-hld]="topic.type === 'hld'" [class.badge-lld]="topic.type === 'lld'">
                    {{ topic.type | uppercase }}
                  </span>
                </div>
                <p class="topic-overview">{{ truncate(topic.overview, 120) }}</p>
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
    .sd-list-page { max-width: 1200px; }
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
    .tab-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }
    .tab-btn {
      padding: 6px 18px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-surface);
      color: var(--color-text-secondary);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition);
    }
    .tab-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
    .tab-btn.active {
      background: var(--color-primary);
      color: #fff;
      border-color: var(--color-primary);
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
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--color-border);
      color: var(--color-text);
      font-size: 1.1rem;
    }
    .topic-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
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
    .topic-overview {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
      line-height: 1.5;
      flex: 1;
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
    .uppercase { text-transform: uppercase; }
  `]
})
export class SdListComponent implements OnInit {
  private progressService = inject(ProgressService);

  allTopics = SYSTEM_DESIGN_TOPICS;

  searchQuery = signal('');
  activeTab = signal<'all' | SdType>('all');
  filteredGroups = signal<CategoryGroup[]>([]);
  completedCount = signal(0);
  overallPercentage = signal(0);

  ngOnInit(): void {
    this.initializeProgress();
    this.updateGroups();
    this.updateOverallProgress();
  }

  setTab(tab: 'all' | SdType): void {
    this.activeTab.set(tab);
    this.updateGroups();
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.updateGroups();
  }

  getStatus(topicId: string): string {
    return this.progressService.getItemStatus('system-design', topicId, '_topic');
  }

  formatStatus(status: string): string {
    return status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  truncate(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen).trimEnd() + '...';
  }

  private initializeProgress(): void {
    const items = this.allTopics.map(t => ({ topicId: t.id, itemId: '_topic' }));
    this.progressService.initializeItems('system-design', items);
  }

  private updateOverallProgress(): void {
    let completed = 0;
    for (const topic of this.allTopics) {
      if (this.progressService.getItemStatus('system-design', topic.id, '_topic') === 'completed') {
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
    const tab = this.activeTab();

    let topics = [...this.allTopics];

    if (tab !== 'all') {
      topics = topics.filter(t => t.type === tab);
    }

    if (query) {
      topics = topics.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.overview.toLowerCase().includes(query)
      );
    }

    const categoryMap = new Map<string, SystemDesignTopic[]>();
    for (const topic of topics.sort((a, b) => a.order - b.order)) {
      const list = categoryMap.get(topic.category) || [];
      list.push(topic);
      categoryMap.set(topic.category, list);
    }

    const groups: CategoryGroup[] = [];
    for (const [category, categoryTopics] of categoryMap) {
      groups.push({ category, topics: categoryTopics });
    }

    this.filteredGroups.set(groups);
  }
}
