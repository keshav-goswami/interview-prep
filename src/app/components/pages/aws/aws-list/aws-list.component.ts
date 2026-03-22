import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressService } from '../../../../services/progress.service';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { AWS_SERVICES } from '../../../../data/aws-services.data';
import { AwsService, AwsCategory } from '../../../../models/aws.model';

interface CategoryGroup {
  category: AwsCategory;
  label: string;
  services: AwsService[];
}

@Component({
  selector: 'app-aws-list',
  standalone: true,
  imports: [RouterLink, ProgressBarComponent],
  template: `
    <div class="aws-list-page">
      <div class="section-header">
        <div>
          <h1>AWS Services</h1>
          <p class="page-subtitle">{{ allServices.length }} services</p>
        </div>
      </div>

      <div class="overall-progress card-flat">
        <div class="overall-stats">
          <span class="stat-completed">{{ completedCount() }} completed</span>
          <span class="stat-total">of {{ allServices.length }} services</span>
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
          placeholder="Search AWS services..."
          [value]="searchQuery()"
          (input)="onSearch($event)"
        />
      </div>

      <!-- Category groups -->
      @for (group of filteredGroups(); track group.category) {
        <section class="category-section">
          <h2 class="category-header">{{ group.label }}</h2>
          <div class="grid-4">
            @for (service of group.services; track service.id) {
              <a [routerLink]="'/aws/' + service.id" class="card service-card">
                <div class="service-top">
                  <h3 class="service-name">{{ service.name }}</h3>
                  <span class="tag category-tag">{{ group.label }}</span>
                </div>
                <p class="service-oneliner">{{ service.oneLiner }}</p>
                <div class="service-footer">
                  <span class="tag status-tag" [class]="'tag-' + getStatus(service.id)">
                    {{ formatStatus(getStatus(service.id)) }}
                  </span>
                </div>
              </a>
            }
          </div>
        </section>
      }

      @if (filteredGroups().length === 0) {
        <div class="empty-state">
          <p>No services match "{{ searchQuery() }}"</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .aws-list-page { max-width: 1200px; }
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
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--color-border);
      color: var(--color-text);
      font-size: 1.1rem;
    }
    .service-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }
    .service-card:hover { text-decoration: none; }
    .service-top {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .service-name {
      font-size: 0.95rem;
      font-weight: 600;
    }
    .category-tag {
      background: var(--color-primary-light);
      color: var(--color-primary);
      align-self: flex-start;
    }
    .service-oneliner {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
      line-height: 1.5;
      flex: 1;
    }
    .service-footer {
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
export class AwsListComponent implements OnInit {
  private progressService = inject(ProgressService);

  allServices = AWS_SERVICES;

  searchQuery = signal('');
  filteredGroups = signal<CategoryGroup[]>([]);
  completedCount = signal(0);
  overallPercentage = signal(0);

  private categoryOrder: AwsCategory[] = [
    'compute', 'serverless', 'containers', 'storage', 'database',
    'networking', 'security', 'messaging', 'monitoring'
  ];

  private categoryLabels: Record<AwsCategory, string> = {
    'compute': 'Compute',
    'serverless': 'Serverless',
    'containers': 'Containers',
    'storage': 'Storage',
    'database': 'Database',
    'networking': 'Networking',
    'security': 'Security',
    'messaging': 'Messaging',
    'monitoring': 'Monitoring'
  };

  ngOnInit(): void {
    this.initializeProgress();
    this.updateGroups();
    this.updateOverallProgress();
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.updateGroups();
  }

  getStatus(serviceId: string): string {
    return this.progressService.getItemStatus('aws', serviceId, '_topic');
  }

  formatStatus(status: string): string {
    return status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  private initializeProgress(): void {
    const items = this.allServices.map(s => ({ topicId: s.id, itemId: '_topic' }));
    this.progressService.initializeItems('aws', items);
  }

  private updateOverallProgress(): void {
    let completed = 0;
    for (const service of this.allServices) {
      if (this.progressService.getItemStatus('aws', service.id, '_topic') === 'completed') {
        completed++;
      }
    }
    this.completedCount.set(completed);
    this.overallPercentage.set(
      this.allServices.length > 0 ? Math.round((completed / this.allServices.length) * 100) : 0
    );
  }

  private updateGroups(): void {
    const query = this.searchQuery().toLowerCase().trim();
    const groups: CategoryGroup[] = [];

    for (const cat of this.categoryOrder) {
      let services = this.allServices.filter(s => s.category === cat);

      if (query) {
        services = services.filter(s =>
          s.name.toLowerCase().includes(query) ||
          s.oneLiner.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query)
        );
      }

      if (services.length > 0) {
        groups.push({
          category: cat,
          label: this.categoryLabels[cat],
          services: services.sort((a, b) => a.order - b.order)
        });
      }
    }

    this.filteredGroups.set(groups);
  }
}
