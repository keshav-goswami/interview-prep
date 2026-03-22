import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProgressService } from '../../../../services/progress.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { ExternalLinkComponent } from '../../../shared/external-link/external-link.component';
import { CACHE_TOPICS } from '../../../../data/cache-topics.data';
import { CacheTopic, CacheCategory } from '../../../../models/cache.model';
import { ItemStatus } from '../../../../models/progress.model';

@Component({
  selector: 'app-cache-topic',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent, ExternalLinkComponent],
  template: `
    @if (topic()) {
      <div class="cache-topic-page">
        <!-- Navigation -->
        <div class="top-nav">
          <a routerLink="/caching" class="back-link">Back to Caching</a>
          <div class="prev-next">
            @if (prevTopic()) {
              <a [routerLink]="'/caching/' + prevTopic()!.id" class="nav-link">Prev</a>
            }
            @if (nextTopic()) {
              <a [routerLink]="'/caching/' + nextTopic()!.id" class="nav-link">Next</a>
            }
          </div>
        </div>

        <!-- Header -->
        <div class="topic-header">
          <h1>{{ topic()!.title }}</h1>
          <div class="header-badges">
            <span class="badge badge-category">{{ categoryLabel(topic()!.category) }}</span>
            <app-status-badge
              [status]="topicStatus()"
              (statusChange)="cycleStatus()"
            />
          </div>
        </div>

        <!-- Explanation -->
        <section class="content-section">
          <h2>Explanation</h2>
          <p class="explanation-text">{{ topic()!.explanation }}</p>
        </section>

        <!-- Use Cases -->
        @if (topic()!.useCases.length > 0) {
          <section class="content-section">
            <h2>Use Cases</h2>
            <div class="use-cases-grid">
              @for (useCase of topic()!.useCases; track useCase.title) {
                <div class="use-case-card card-flat">
                  <h3 class="use-case-title">{{ useCase.title }}</h3>
                  <p class="use-case-scenario">{{ useCase.scenario }}</p>
                  <pre class="use-case-impl"><code>{{ useCase.implementation }}</code></pre>
                </div>
              }
            </div>
          </section>
        }

        <!-- Key Commands -->
        @if (topic()!.keyCommands.length > 0) {
          <section class="content-section">
            <h2>Key Commands</h2>
            <div class="commands-list">
              @for (cmd of topic()!.keyCommands; track cmd.command) {
                <div class="command-block">
                  <code class="command-text">{{ cmd.command }}</code>
                  <span class="command-desc">{{ cmd.description }}</span>
                </div>
              }
            </div>
          </section>
        }

        <!-- Best Practices -->
        @if (topic()!.bestPractices.length > 0) {
          <section class="content-section">
            <h2>Best Practices</h2>
            <ul class="bullet-list">
              @for (practice of topic()!.bestPractices; track $index) {
                <li>{{ practice }}</li>
              }
            </ul>
          </section>
        }

        <!-- Interview Questions -->
        @if (topic()!.interviewQuestions.length > 0) {
          <section class="content-section">
            <h2>Interview Questions</h2>
            <ul class="question-list">
              @for (question of topic()!.interviewQuestions; track $index) {
                <li>{{ question }}</li>
              }
            </ul>
          </section>
        }

        <!-- Resources -->
        @if (topic()!.resources.length > 0) {
          <section class="content-section">
            <h2>Resources</h2>
            <div class="resources-row">
              @for (link of topic()!.resources; track link.url) {
                <app-external-link [link]="link" />
              }
            </div>
          </section>
        }

        <!-- Bottom Navigation -->
        <div class="bottom-nav">
          <a routerLink="/caching" class="back-link">Back to Caching</a>
          <div class="prev-next">
            @if (prevTopic()) {
              <a [routerLink]="'/caching/' + prevTopic()!.id" class="nav-link">Prev: {{ prevTopic()!.title }}</a>
            }
            @if (nextTopic()) {
              <a [routerLink]="'/caching/' + nextTopic()!.id" class="nav-link">Next: {{ nextTopic()!.title }}</a>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .cache-topic-page { max-width: 860px; }
    .top-nav, .bottom-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--color-border);
    }
    .bottom-nav {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid var(--color-border);
      border-bottom: none;
    }
    .back-link {
      font-size: 0.85rem;
      color: var(--color-primary);
      text-decoration: none;
    }
    .back-link:hover { text-decoration: underline; }
    .prev-next { display: flex; gap: 12px; }
    .nav-link {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
      text-decoration: none;
      padding: 4px 10px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      transition: all var(--transition);
    }
    .nav-link:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    .topic-header {
      margin-bottom: 32px;
    }
    .topic-header h1 {
      margin-bottom: 12px;
      font-size: 1.6rem;
    }
    .header-badges {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .badge-category {
      background: var(--color-primary-light);
      color: var(--color-primary);
    }
    .content-section {
      margin-bottom: 28px;
    }
    .content-section h2 {
      font-size: 1.1rem;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--color-border-light);
    }
    .explanation-text {
      font-size: 0.9rem;
      line-height: 1.7;
      color: var(--color-text-secondary);
      white-space: pre-line;
    }

    /* Use Cases */
    .use-cases-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .use-case-card {
      padding: 18px 20px;
    }
    .use-case-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 8px;
    }
    .use-case-scenario {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
      line-height: 1.5;
      margin-bottom: 12px;
    }
    .use-case-impl {
      background: #1e1e2e;
      color: #cdd6f4;
      padding: 16px;
      border-radius: var(--radius-sm);
      overflow-x: auto;
      font-size: 0.8rem;
      line-height: 1.5;
      margin: 0;
    }
    .use-case-impl code {
      font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
      white-space: pre;
    }

    /* Key Commands */
    .commands-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .command-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px 16px;
      background: #1e1e2e;
      border-radius: var(--radius-sm);
      border-left: 3px solid var(--color-primary);
    }
    .command-text {
      font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
      font-size: 0.85rem;
      color: #a6e3a1;
      font-weight: 600;
    }
    .command-desc {
      font-size: 0.8rem;
      color: #bac2de;
      line-height: 1.4;
    }

    /* Best Practices */
    .bullet-list {
      list-style: disc;
      padding-left: 24px;
    }
    .bullet-list li {
      font-size: 0.88rem;
      line-height: 1.6;
      margin-bottom: 6px;
      color: var(--color-text-secondary);
    }

    /* Interview Questions */
    .question-list {
      list-style: none;
      padding-left: 0;
      counter-reset: q;
    }
    .question-list li {
      font-size: 0.88rem;
      line-height: 1.6;
      margin-bottom: 10px;
      padding: 10px 14px;
      background: var(--color-surface-alt, var(--color-border-light));
      border-radius: var(--radius-sm);
      color: var(--color-text);
      counter-increment: q;
    }
    .question-list li::before {
      content: 'Q' counter(q) '. ';
      font-weight: 700;
      color: var(--color-primary);
    }

    /* Resources */
    .resources-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `]
})
export class CacheTopicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private progressService = inject(ProgressService);

  topic = signal<CacheTopic | null>(null);
  prevTopic = signal<CacheTopic | null>(null);
  nextTopic = signal<CacheTopic | null>(null);
  topicStatus = signal<ItemStatus>('not-started');

  private allTopics = CACHE_TOPICS;

  private categoryLabels: Record<CacheCategory, string> = {
    'fundamentals': 'Fundamentals',
    'redis': 'Redis Deep Dive',
    'patterns': 'Patterns',
    'data-structures': 'Data Structures',
    'production': 'Production',
    'alternatives': 'Alternatives'
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const topicId = params.get('topicId') || '';
      this.loadTopic(topicId);
    });
  }

  cycleStatus(): void {
    const t = this.topic();
    if (!t) return;
    this.progressService.cycleItemStatus('caching', t.id, '_topic');
    this.topicStatus.set(this.progressService.getItemStatus('caching', t.id, '_topic'));
  }

  categoryLabel(cat: CacheCategory): string {
    return this.categoryLabels[cat] || cat;
  }

  private loadTopic(topicId: string): void {
    const sorted = [...this.allTopics].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(t => t.id === topicId);
    if (idx === -1) return;

    this.topic.set(sorted[idx]);
    this.prevTopic.set(idx > 0 ? sorted[idx - 1] : null);
    this.nextTopic.set(idx < sorted.length - 1 ? sorted[idx + 1] : null);
    this.topicStatus.set(this.progressService.getItemStatus('caching', topicId, '_topic'));
  }
}
