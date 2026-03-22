import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressService } from '../../../../services/progress.service';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { DSA_PATTERNS } from '../../../../data/dsa-patterns.data';
import { DsaPattern } from '../../../../models/dsa.model';

interface TierGroup {
  tier: number;
  label: string;
  patterns: DsaPattern[];
}

@Component({
  selector: 'app-dsa-list',
  standalone: true,
  imports: [RouterLink, ProgressBarComponent],
  template: `
    <div class="dsa-list-page">
      <!-- Header with overall progress -->
      <div class="section-header">
        <div>
          <h1>DSA Patterns</h1>
          <p class="page-subtitle">{{ allPatterns.length }} patterns &middot; {{ totalProblems }} problems</p>
        </div>
      </div>

      <div class="overall-progress card-flat">
        <div class="overall-stats">
          <span class="stat-completed">{{ completedProblems() }} completed</span>
          <span class="stat-total">of {{ totalProblems }} problems</span>
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
          placeholder="Search patterns..."
          [value]="searchQuery()"
          (input)="onSearch($event)"
        />
      </div>

      <!-- Tier groups -->
      @for (group of filteredGroups(); track group.tier) {
        <section class="tier-section">
          <h2 class="tier-header">{{ group.label }}</h2>
          <div class="grid-4">
            @for (pattern of group.patterns; track pattern.id) {
              <a [routerLink]="'/dsa/' + pattern.id" class="card pattern-card">
                <div class="pattern-top">
                  <h3 class="pattern-name">{{ pattern.name }}</h3>
                  <span class="badge badge-category">{{ pattern.category }}</span>
                </div>
                <div class="pattern-meta">
                  <span class="problem-count">{{ pattern.problems.length }} problems</span>
                </div>
                <div class="pattern-progress">
                  <app-progress-bar
                    [percentage]="getPatternProgress(pattern)"
                    height="6px"
                    [showLabel]="true"
                  />
                </div>
              </a>
            }
          </div>
        </section>
      }

      @if (filteredGroups().length === 0) {
        <div class="empty-state">
          <p>No patterns match "{{ searchQuery() }}"</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .dsa-list-page {
      max-width: 1200px;
    }
    .page-subtitle {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      margin-top: 4px;
    }
    .overall-progress {
      margin-bottom: 24px;
    }
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
    .search-wrapper {
      margin-bottom: 28px;
    }
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
    .search-input::placeholder {
      color: var(--color-text-muted);
    }
    .search-input:focus {
      border-color: var(--color-primary);
    }
    .tier-section {
      margin-bottom: 32px;
    }
    .tier-header {
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--color-border);
      color: var(--color-text);
      font-size: 1.1rem;
    }
    .pattern-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }
    .pattern-card:hover {
      text-decoration: none;
    }
    .pattern-top {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .pattern-name {
      font-size: 0.95rem;
      font-weight: 600;
    }
    .badge-category {
      background: var(--color-primary-light);
      color: var(--color-primary);
      align-self: flex-start;
    }
    .pattern-meta {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
    }
    .pattern-progress {
      margin-top: auto;
    }
  `]
})
export class DsaListComponent implements OnInit {
  private progressService = inject(ProgressService);

  allPatterns = DSA_PATTERNS;
  totalProblems = DSA_PATTERNS.reduce((sum, p) => sum + p.problems.length, 0);

  searchQuery = signal('');
  completedProblems = signal(0);
  overallPercentage = signal(0);

  private tierLabels: Record<number, string> = {
    1: 'Tier 1 — Must Know (90%+ interviews)',
    2: 'Tier 2 — Highly Important (70%+ interviews)',
    3: 'Tier 3 — Advanced (Differentiators)',
    4: 'Tier 4 — Niche (Rare but Impressive)'
  };

  filteredGroups = signal<TierGroup[]>([]);

  ngOnInit(): void {
    this.initializeProgress();
    this.updateGroups();
    this.updateOverallProgress();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.updateGroups();
  }

  getPatternProgress(pattern: DsaPattern): number {
    if (pattern.problems.length === 0) return 0;
    let completed = 0;
    for (const problem of pattern.problems) {
      if (this.progressService.getItemStatus('dsa', pattern.id, problem.id) === 'completed') {
        completed++;
      }
    }
    return Math.round((completed / pattern.problems.length) * 100);
  }

  private initializeProgress(): void {
    const items: { topicId: string; itemId: string }[] = [];
    for (const pattern of DSA_PATTERNS) {
      for (const problem of pattern.problems) {
        items.push({ topicId: pattern.id, itemId: problem.id });
      }
    }
    this.progressService.initializeItems('dsa', items);
  }

  private updateOverallProgress(): void {
    let completed = 0;
    for (const pattern of DSA_PATTERNS) {
      for (const problem of pattern.problems) {
        if (this.progressService.getItemStatus('dsa', pattern.id, problem.id) === 'completed') {
          completed++;
        }
      }
    }
    this.completedProblems.set(completed);
    this.overallPercentage.set(
      this.totalProblems > 0 ? Math.round((completed / this.totalProblems) * 100) : 0
    );
  }

  private updateGroups(): void {
    const query = this.searchQuery().toLowerCase().trim();
    const tiers = [1, 2, 3, 4];
    const groups: TierGroup[] = [];

    for (const tier of tiers) {
      let patterns = DSA_PATTERNS.filter(p => p.tier === tier);
      if (query) {
        patterns = patterns.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      }
      if (patterns.length > 0) {
        groups.push({
          tier,
          label: this.tierLabels[tier],
          patterns: patterns.sort((a, b) => a.order - b.order)
        });
      }
    }

    this.filteredGroups.set(groups);
  }
}
