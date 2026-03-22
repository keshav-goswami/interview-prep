import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProgressService } from '../../../../services/progress.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { ExternalLinkComponent } from '../../../shared/external-link/external-link.component';
import { DSA_PATTERNS } from '../../../../data/dsa-patterns.data';
import { DsaPattern, DsaProblem } from '../../../../models/dsa.model';
import { ItemStatus } from '../../../../models/progress.model';

@Component({
  selector: 'app-dsa-pattern',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent, ExternalLinkComponent],
  template: `
    @if (pattern) {
      <div class="pattern-page">
        <!-- Navigation -->
        <div class="nav-row">
          <a routerLink="/dsa" class="back-link">&larr; All Patterns</a>
          <div class="prev-next">
            @if (prevPattern) {
              <a [routerLink]="'/dsa/' + prevPattern.id" class="btn">&larr; {{ prevPattern.name }}</a>
            }
            @if (nextPattern) {
              <a [routerLink]="'/dsa/' + nextPattern.id" class="btn">{{ nextPattern.name }} &rarr;</a>
            }
          </div>
        </div>

        <!-- Header -->
        <div class="pattern-header">
          <h1>{{ pattern.name }}</h1>
          <div class="header-badges">
            <span class="badge badge-tier" [class]="'tier-' + pattern.tier">Tier {{ pattern.tier }}</span>
            <span class="badge badge-category">{{ pattern.category }}</span>
          </div>
        </div>

        <!-- Explanation -->
        <section class="content-section">
          <h2>Explanation</h2>
          <div class="explanation-text">{{ pattern.explanation }}</div>
        </section>

        <!-- When to Use -->
        @if (pattern.whenToUse.length > 0) {
          <section class="content-section">
            <h2>When to Use</h2>
            <ul class="when-list">
              @for (item of pattern.whenToUse; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </section>
        }

        <!-- Trick / Memory Aid -->
        @if (pattern.trick) {
          <section class="content-section">
            <div class="trick-box">
              <h3 class="trick-title">Trick / Memory Aid</h3>
              <p class="trick-text">{{ pattern.trick }}</p>
            </div>
          </section>
        }

        <!-- Code Template -->
        @if (pattern.codeTemplate) {
          <section class="content-section">
            <h2>Code Template</h2>
            <pre><code>{{ pattern.codeTemplate }}</code></pre>
          </section>
        }

        <!-- Problems -->
        @if (pattern.problems.length > 0) {
          <section class="content-section">
            <h2>Problems ({{ pattern.problems.length }})</h2>
            <div class="problems-list">
              @for (problem of pattern.problems; track problem.id) {
                <div class="problem-row">
                  <div class="problem-status">
                    <app-status-badge
                      [status]="getStatus(problem)"
                      (statusChange)="cycleStatus(problem)"
                    />
                  </div>
                  <div class="problem-info">
                    <span class="problem-title">{{ problem.title }}</span>
                    <div class="problem-tags tag-list">
                      @for (tag of problem.tags; track tag) {
                        <span class="tag">{{ tag }}</span>
                      }
                    </div>
                  </div>
                  <span class="badge" [class]="'badge-' + problem.difficulty">{{ problem.difficulty }}</span>
                  <div class="problem-links link-group">
                    @for (link of problem.links; track link.url) {
                      <app-external-link [link]="link" />
                    }
                  </div>
                </div>
              }
            </div>
          </section>
        }

        <!-- Resources -->
        @if (pattern.resources.length > 0) {
          <section class="content-section">
            <h2>Resources</h2>
            <div class="link-group">
              @for (link of pattern.resources; track link.url) {
                <app-external-link [link]="link" />
              }
            </div>
          </section>
        }

        <!-- Bottom navigation -->
        <div class="nav-row bottom-nav">
          <a routerLink="/dsa" class="back-link">&larr; All Patterns</a>
          <div class="prev-next">
            @if (prevPattern) {
              <a [routerLink]="'/dsa/' + prevPattern.id" class="btn">&larr; {{ prevPattern.name }}</a>
            }
            @if (nextPattern) {
              <a [routerLink]="'/dsa/' + nextPattern.id" class="btn">{{ nextPattern.name }} &rarr;</a>
            }
          </div>
        </div>
      </div>
    } @else {
      <div class="empty-state">
        <h2>Pattern not found</h2>
        <p>The requested DSA pattern does not exist.</p>
        <a routerLink="/dsa" class="btn btn-primary">Back to Patterns</a>
      </div>
    }
  `,
  styles: [`
    .pattern-page {
      max-width: 900px;
    }
    .nav-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .bottom-nav {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid var(--color-border);
      margin-bottom: 0;
    }
    .back-link {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      text-decoration: none;
    }
    .back-link:hover {
      color: var(--color-primary);
      text-decoration: none;
    }
    .prev-next {
      display: flex;
      gap: 8px;
    }
    .prev-next .btn {
      font-size: 0.82rem;
      padding: 6px 12px;
      text-decoration: none;
    }
    .prev-next .btn:hover {
      text-decoration: none;
    }
    .pattern-header {
      margin-bottom: 32px;
    }
    .pattern-header h1 {
      margin-bottom: 12px;
    }
    .header-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .badge-tier {
      font-weight: 700;
    }
    .tier-1 {
      background: var(--color-danger-light);
      color: var(--color-danger);
    }
    .tier-2 {
      background: var(--color-warning-light);
      color: var(--color-warning);
    }
    .tier-3 {
      background: var(--color-info-light);
      color: var(--color-info);
    }
    .tier-4 {
      background: var(--color-border-light);
      color: var(--color-text-secondary);
    }
    .badge-category {
      background: var(--color-primary-light);
      color: var(--color-primary);
    }
    .content-section {
      margin-bottom: 28px;
    }
    .content-section h2 {
      font-size: 1.15rem;
      margin-bottom: 12px;
      color: var(--color-text);
    }
    .explanation-text {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      line-height: 1.75;
      white-space: pre-line;
    }
    .when-list {
      list-style: none;
      padding: 0;
    }
    .when-list li {
      position: relative;
      padding: 8px 0 8px 24px;
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
      border-bottom: 1px solid var(--color-border-light);
    }
    .when-list li:last-child {
      border-bottom: none;
    }
    .when-list li::before {
      content: '>';
      position: absolute;
      left: 4px;
      color: var(--color-primary);
      font-weight: 700;
      font-family: var(--font-mono);
      font-size: 0.85rem;
    }

    /* Trick box - amber note card */
    .trick-box {
      background: #fffbeb;
      border: 1px solid #fbbf24;
      border-left: 4px solid #f59e0b;
      border-radius: var(--radius);
      padding: 20px 24px;
    }
    :host-context([data-theme="dark"]) .trick-box {
      background: #422006;
      border-color: #92400e;
      border-left-color: #f59e0b;
    }
    .trick-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #92400e;
      margin-bottom: 8px;
    }
    :host-context([data-theme="dark"]) .trick-title {
      color: #fbbf24;
    }
    .trick-text {
      font-size: 0.9rem;
      line-height: 1.7;
      color: #78350f;
      font-weight: 500;
    }
    :host-context([data-theme="dark"]) .trick-text {
      color: #fde68a;
    }

    /* Problems list */
    .problems-list {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      overflow: hidden;
    }
    .problem-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 20px;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      transition: background var(--transition);
    }
    .problem-row:last-child {
      border-bottom: none;
    }
    .problem-row:hover {
      background: var(--color-surface-hover);
    }
    .problem-status {
      flex-shrink: 0;
    }
    .problem-info {
      flex: 1;
      min-width: 0;
    }
    .problem-title {
      font-size: 0.9rem;
      font-weight: 500;
      display: block;
      margin-bottom: 4px;
    }
    .problem-tags {
      margin-top: 4px;
    }
    .problem-links {
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      .problem-row {
        flex-wrap: wrap;
        gap: 10px;
        padding: 12px 14px;
      }
      .problem-info {
        flex-basis: calc(100% - 130px);
      }
      .problem-links {
        flex-basis: 100%;
      }
      .prev-next {
        flex-basis: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class DsaPatternComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private progressService = inject(ProgressService);

  pattern: DsaPattern | null = null;
  prevPattern: DsaPattern | null = null;
  nextPattern: DsaPattern | null = null;

  private sortedPatterns = [...DSA_PATTERNS].sort((a, b) => a.tier - b.tier || a.order - b.order);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const patternId = params['patternId'];
      this.loadPattern(patternId);
    });
  }

  cycleStatus(problem: DsaProblem): void {
    this.progressService.cycleItemStatus('dsa', this.pattern!.id, problem.id);
  }

  getStatus(problem: DsaProblem): ItemStatus {
    return this.progressService.getItemStatus('dsa', this.pattern!.id, problem.id);
  }

  private loadPattern(patternId: string): void {
    const index = this.sortedPatterns.findIndex(p => p.id === patternId);
    if (index === -1) {
      this.pattern = null;
      this.prevPattern = null;
      this.nextPattern = null;
      return;
    }

    this.pattern = this.sortedPatterns[index];
    this.prevPattern = index > 0 ? this.sortedPatterns[index - 1] : null;
    this.nextPattern = index < this.sortedPatterns.length - 1 ? this.sortedPatterns[index + 1] : null;

    // Initialize progress tracking for this pattern's problems
    const items = this.pattern.problems.map(p => ({
      topicId: this.pattern!.id,
      itemId: p.id
    }));
    this.progressService.initializeItems('dsa', items);
  }
}
