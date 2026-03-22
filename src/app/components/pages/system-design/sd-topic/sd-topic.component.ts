import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProgressService } from '../../../../services/progress.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { ExternalLinkComponent } from '../../../shared/external-link/external-link.component';
import { SYSTEM_DESIGN_TOPICS } from '../../../../data/system-design-topics.data';
import { SystemDesignTopic } from '../../../../models/system-design.model';
import { ItemStatus } from '../../../../models/progress.model';

@Component({
  selector: 'app-sd-topic',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent, ExternalLinkComponent],
  template: `
    @if (topic()) {
      <div class="sd-topic-page">
        <!-- Navigation -->
        <div class="top-nav">
          <a routerLink="/system-design" class="back-link">Back to System Design</a>
          <div class="prev-next">
            @if (prevTopic()) {
              <a [routerLink]="'/system-design/' + prevTopic()!.id" class="nav-link">Prev</a>
            }
            @if (nextTopic()) {
              <a [routerLink]="'/system-design/' + nextTopic()!.id" class="nav-link">Next</a>
            }
          </div>
        </div>

        <!-- Header -->
        <div class="topic-header">
          <h1>{{ topic()!.title }}</h1>
          <div class="header-badges">
            <span class="badge" [class.badge-hld]="topic()!.type === 'hld'" [class.badge-lld]="topic()!.type === 'lld'" [class.badge-easy]="topic()!.type === 'foundation'">
              {{ topic()!.type === 'foundation' ? 'Foundation' : topic()!.type === 'hld' ? 'HLD' : 'LLD' }}
            </span>
            <app-status-badge
              [status]="topicStatus()"
              (statusChange)="cycleStatus()"
            />
          </div>
        </div>

        <!-- Overview -->
        <section class="content-section">
          <h2>Overview</h2>
          <p class="overview-text">{{ topic()!.overview }}</p>
        </section>

        <!-- Framework -->
        @if (topic()!.framework.length > 0) {
          <section class="content-section">
            <h2>Framework</h2>
            <ol class="framework-list">
              @for (step of topic()!.framework; track $index) {
                <li>{{ step }}</li>
              }
            </ol>
          </section>
        }

        <!-- Key Components -->
        @if (topic()!.keyComponents.length > 0) {
          <section class="content-section">
            <h2>Key Components</h2>
            <ul class="bullet-list">
              @for (component of topic()!.keyComponents; track $index) {
                <li>{{ component }}</li>
              }
            </ul>
          </section>
        }

        <!-- Scale Considerations -->
        @if (topic()!.scaleConsiderations.length > 0) {
          <section class="content-section">
            <h2>Scale Considerations</h2>
            <ul class="bullet-list">
              @for (item of topic()!.scaleConsiderations; track $index) {
                <li>{{ item }}</li>
              }
            </ul>
          </section>
        }

        <!-- Common Mistakes -->
        @if (topic()!.commonMistakes.length > 0) {
          <section class="content-section">
            <h2>Common Mistakes</h2>
            <ul class="warning-list">
              @for (mistake of topic()!.commonMistakes; track $index) {
                <li>{{ mistake }}</li>
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

        <!-- Related Topics -->
        @if (topic()!.relatedTopics.length > 0) {
          <section class="content-section">
            <h2>Related Topics</h2>
            <div class="related-links">
              @for (relatedId of topic()!.relatedTopics; track relatedId) {
                @if (getTopicTitle(relatedId); as title) {
                  <a [routerLink]="'/system-design/' + relatedId" class="related-chip">{{ title }}</a>
                }
              }
            </div>
          </section>
        }

        <!-- Bottom Navigation -->
        <div class="bottom-nav">
          <a routerLink="/system-design" class="back-link">Back to System Design</a>
          <div class="prev-next">
            @if (prevTopic()) {
              <a [routerLink]="'/system-design/' + prevTopic()!.id" class="nav-link">Prev: {{ prevTopic()!.title }}</a>
            }
            @if (nextTopic()) {
              <a [routerLink]="'/system-design/' + nextTopic()!.id" class="nav-link">Next: {{ nextTopic()!.title }}</a>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .sd-topic-page { max-width: 860px; }
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
    .content-section {
      margin-bottom: 28px;
    }
    .content-section h2 {
      font-size: 1.1rem;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--color-border-light);
    }
    .overview-text {
      font-size: 0.9rem;
      line-height: 1.7;
      color: var(--color-text-secondary);
      white-space: pre-line;
    }
    .framework-list {
      list-style: decimal;
      padding-left: 24px;
    }
    .framework-list li {
      font-size: 0.88rem;
      line-height: 1.6;
      margin-bottom: 8px;
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
    .warning-list {
      list-style: none;
      padding-left: 0;
    }
    .warning-list li {
      font-size: 0.88rem;
      line-height: 1.6;
      margin-bottom: 8px;
      padding: 10px 14px;
      background: var(--color-warning-light);
      border-left: 3px solid var(--color-warning);
      border-radius: var(--radius-sm);
      color: var(--color-text);
    }
    .resources-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .related-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .related-chip {
      display: inline-block;
      padding: 4px 14px;
      border: 1px solid var(--color-border);
      border-radius: 20px;
      font-size: 0.82rem;
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: all var(--transition);
    }
    .related-chip:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  `]
})
export class SdTopicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private progressService = inject(ProgressService);

  topic = signal<SystemDesignTopic | null>(null);
  prevTopic = signal<SystemDesignTopic | null>(null);
  nextTopic = signal<SystemDesignTopic | null>(null);
  topicStatus = signal<ItemStatus>('not-started');

  private allTopics = SYSTEM_DESIGN_TOPICS;
  private topicMap = new Map<string, string>();

  ngOnInit(): void {
    for (const t of this.allTopics) {
      this.topicMap.set(t.id, t.title);
    }

    this.route.paramMap.subscribe(params => {
      const topicId = params.get('topicId') || '';
      this.loadTopic(topicId);
    });
  }

  cycleStatus(): void {
    const t = this.topic();
    if (!t) return;
    this.progressService.cycleItemStatus('system-design', t.id, '_topic');
    this.topicStatus.set(this.progressService.getItemStatus('system-design', t.id, '_topic'));
  }

  getTopicTitle(id: string): string {
    return this.topicMap.get(id) || id;
  }

  private loadTopic(topicId: string): void {
    const sorted = [...this.allTopics].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(t => t.id === topicId);
    if (idx === -1) return;

    this.topic.set(sorted[idx]);
    this.prevTopic.set(idx > 0 ? sorted[idx - 1] : null);
    this.nextTopic.set(idx < sorted.length - 1 ? sorted[idx + 1] : null);
    this.topicStatus.set(this.progressService.getItemStatus('system-design', topicId, '_topic'));
  }
}
