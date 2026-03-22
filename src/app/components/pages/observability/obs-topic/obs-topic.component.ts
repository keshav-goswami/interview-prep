import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProgressService } from '../../../../services/progress.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { ExternalLinkComponent } from '../../../shared/external-link/external-link.component';
import { OBSERVABILITY_TOPICS } from '../../../../data/observability-topics.data';
import { ObservabilityTopic, ObsCategory } from '../../../../models/observability.model';
import { ItemStatus } from '../../../../models/progress.model';

@Component({
  selector: 'app-obs-topic',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent, ExternalLinkComponent],
  template: `
    @if (topic()) {
      <div class="obs-topic-page">
        <!-- Navigation -->
        <div class="top-nav">
          <a routerLink="/observability" class="back-link">Back to Observability</a>
          <div class="prev-next">
            @if (prevTopic()) {
              <a [routerLink]="'/observability/' + prevTopic()!.id" class="nav-link">Prev</a>
            }
            @if (nextTopic()) {
              <a [routerLink]="'/observability/' + nextTopic()!.id" class="nav-link">Next</a>
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

        <!-- Tools -->
        @if (topic()!.tools.length > 0) {
          <section class="content-section">
            <h2>Tools</h2>
            <div class="tools-grid">
              @for (tool of topic()!.tools; track tool.name) {
                <div class="tool-card card-flat">
                  <h3 class="tool-name">{{ tool.name }}</h3>
                  <p class="tool-purpose">{{ tool.purpose }}</p>
                  @if (tool.keyFeatures.length > 0) {
                    <ul class="tool-features">
                      @for (feature of tool.keyFeatures; track $index) {
                        <li>{{ feature }}</li>
                      }
                    </ul>
                  }
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
          <a routerLink="/observability" class="back-link">Back to Observability</a>
          <div class="prev-next">
            @if (prevTopic()) {
              <a [routerLink]="'/observability/' + prevTopic()!.id" class="nav-link">Prev: {{ prevTopic()!.title }}</a>
            }
            @if (nextTopic()) {
              <a [routerLink]="'/observability/' + nextTopic()!.id" class="nav-link">Next: {{ nextTopic()!.title }}</a>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .obs-topic-page { max-width: 860px; }
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
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    .tool-card {
      padding: 18px 20px;
    }
    .tool-name {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 6px;
    }
    .tool-purpose {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
      line-height: 1.5;
      margin-bottom: 10px;
    }
    .tool-features {
      list-style: disc;
      padding-left: 20px;
      margin: 0;
    }
    .tool-features li {
      font-size: 0.82rem;
      line-height: 1.5;
      margin-bottom: 4px;
      color: var(--color-text-secondary);
    }
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
    .resources-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `]
})
export class ObsTopicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private progressService = inject(ProgressService);

  topic = signal<ObservabilityTopic | null>(null);
  prevTopic = signal<ObservabilityTopic | null>(null);
  nextTopic = signal<ObservabilityTopic | null>(null);
  topicStatus = signal<ItemStatus>('not-started');

  private allTopics = OBSERVABILITY_TOPICS;

  private categoryLabels: Record<ObsCategory, string> = {
    'metrics': 'Metrics',
    'logging': 'Logging',
    'tracing': 'Tracing',
    'alerting': 'Alerting',
    'performance': 'Performance',
    'practices': 'Practices'
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
    this.progressService.cycleItemStatus('observability', t.id, '_topic');
    this.topicStatus.set(this.progressService.getItemStatus('observability', t.id, '_topic'));
  }

  categoryLabel(cat: ObsCategory): string {
    return this.categoryLabels[cat] || cat;
  }

  private loadTopic(topicId: string): void {
    const sorted = [...this.allTopics].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(t => t.id === topicId);
    if (idx === -1) return;

    this.topic.set(sorted[idx]);
    this.prevTopic.set(idx > 0 ? sorted[idx - 1] : null);
    this.nextTopic.set(idx < sorted.length - 1 ? sorted[idx + 1] : null);
    this.topicStatus.set(this.progressService.getItemStatus('observability', topicId, '_topic'));
  }
}
