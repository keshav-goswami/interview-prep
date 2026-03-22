import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProgressService } from '../../../../services/progress.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { ExternalLinkComponent } from '../../../shared/external-link/external-link.component';
import { JAVA_TOPICS } from '../../../../data/java-topics.data';
import { JavaTopic, JavaCategory } from '../../../../models/java.model';
import { ItemStatus } from '../../../../models/progress.model';

@Component({
  selector: 'app-java-topic',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent, ExternalLinkComponent],
  template: `
    @if (topic()) {
      <div class="java-topic-page">
        <!-- Navigation -->
        <div class="top-nav">
          <a routerLink="/java" class="back-link">Back to Java & Spring</a>
          <div class="prev-next">
            @if (prevTopic()) {
              <a [routerLink]="'/java/' + prevTopic()!.id" class="nav-link">Prev</a>
            }
            @if (nextTopic()) {
              <a [routerLink]="'/java/' + nextTopic()!.id" class="nav-link">Next</a>
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

        <!-- Code Examples -->
        @if (topic()!.codeExamples.length > 0) {
          <section class="content-section">
            <h2>Code Examples</h2>
            <div class="code-examples-list">
              @for (example of topic()!.codeExamples; track $index) {
                <div class="code-example-card">
                  <h3 class="code-example-title">{{ example.title }}</h3>
                  <div class="code-block-wrapper">
                    <pre class="code-block"><code>{{ example.code }}</code></pre>
                  </div>
                  <p class="code-explanation">{{ example.explanation }}</p>
                </div>
              }
            </div>
          </section>
        }

        <!-- Best Practices -->
        @if (topic()!.bestPractices.length > 0) {
          <section class="content-section">
            <h2>Best Practices</h2>
            <ul class="practice-list">
              @for (practice of topic()!.bestPractices; track $index) {
                <li>
                  <span class="practice-icon">&#x2705;</span>
                  {{ practice }}
                </li>
              }
            </ul>
          </section>
        }

        <!-- Common Mistakes -->
        @if (topic()!.commonMistakes.length > 0) {
          <section class="content-section">
            <h2>Common Mistakes</h2>
            <ul class="mistake-list">
              @for (mistake of topic()!.commonMistakes; track $index) {
                <li>
                  <span class="mistake-icon">&#x26A0;&#xFE0F;</span>
                  {{ mistake }}
                </li>
              }
            </ul>
          </section>
        }

        <!-- Interview Questions -->
        @if (topic()!.interviewQuestions.length > 0) {
          <section class="content-section">
            <h2>Interview Questions</h2>
            <ol class="question-list">
              @for (question of topic()!.interviewQuestions; track $index) {
                <li>{{ question }}</li>
              }
            </ol>
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
          <a routerLink="/java" class="back-link">Back to Java & Spring</a>
          <div class="prev-next">
            @if (prevTopic()) {
              <a [routerLink]="'/java/' + prevTopic()!.id" class="nav-link">Prev: {{ prevTopic()!.title }}</a>
            }
            @if (nextTopic()) {
              <a [routerLink]="'/java/' + nextTopic()!.id" class="nav-link">Next: {{ nextTopic()!.title }}</a>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .java-topic-page { max-width: 860px; }
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

    /* Code Examples */
    .code-examples-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .code-example-card {
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      overflow: hidden;
    }
    .code-example-title {
      font-size: 0.95rem;
      font-weight: 600;
      padding: 12px 18px;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      margin: 0;
    }
    .code-block-wrapper {
      overflow-x: auto;
    }
    .code-block {
      margin: 0;
      padding: 18px;
      background: #1e1e2e;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.82rem;
      line-height: 1.6;
      color: #cdd6f4;
      overflow-x: auto;
      white-space: pre;
    }
    .code-block code {
      font-family: inherit;
      font-size: inherit;
      color: inherit;
    }
    .code-explanation {
      padding: 14px 18px;
      margin: 0;
      font-size: 0.85rem;
      line-height: 1.6;
      color: var(--color-text-secondary);
      background: var(--color-surface);
      border-top: 1px solid var(--color-border-light);
    }

    /* Best Practices */
    .practice-list {
      list-style: none;
      padding-left: 0;
    }
    .practice-list li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 0.88rem;
      line-height: 1.6;
      margin-bottom: 8px;
      padding: 8px 12px;
      background: var(--color-success-light);
      border-radius: var(--radius-sm);
      color: var(--color-text);
    }
    .practice-icon {
      flex-shrink: 0;
      font-size: 0.9rem;
      margin-top: 2px;
    }

    /* Common Mistakes */
    .mistake-list {
      list-style: none;
      padding-left: 0;
    }
    .mistake-list li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 0.88rem;
      line-height: 1.6;
      margin-bottom: 8px;
      padding: 8px 12px;
      background: var(--color-warning-light);
      border-radius: var(--radius-sm);
      color: var(--color-text);
    }
    .mistake-icon {
      flex-shrink: 0;
      font-size: 0.9rem;
      margin-top: 2px;
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
export class JavaTopicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private progressService = inject(ProgressService);

  topic = signal<JavaTopic | null>(null);
  prevTopic = signal<JavaTopic | null>(null);
  nextTopic = signal<JavaTopic | null>(null);
  topicStatus = signal<ItemStatus>('not-started');

  private allTopics = JAVA_TOPICS;

  private categoryLabels: Record<JavaCategory, string> = {
    'core-java': 'Core Java',
    'spring-boot': 'Spring Boot',
    'spring-security': 'Spring Security',
    'spring-data': 'Spring Data',
    'spring-cloud': 'Spring Cloud',
    'api-docs': 'API Docs',
    'rate-limiting': 'Rate Limiting',
    'validation': 'Validation',
    'tooling': 'Tooling'
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
    this.progressService.cycleItemStatus('java', t.id, '_topic');
    this.topicStatus.set(this.progressService.getItemStatus('java', t.id, '_topic'));
  }

  categoryLabel(cat: JavaCategory): string {
    return this.categoryLabels[cat] || cat;
  }

  private loadTopic(topicId: string): void {
    const sorted = [...this.allTopics].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(t => t.id === topicId);
    if (idx === -1) return;

    this.topic.set(sorted[idx]);
    this.prevTopic.set(idx > 0 ? sorted[idx - 1] : null);
    this.nextTopic.set(idx < sorted.length - 1 ? sorted[idx + 1] : null);
    this.topicStatus.set(this.progressService.getItemStatus('java', topicId, '_topic'));
  }
}
