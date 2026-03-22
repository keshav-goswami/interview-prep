import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProgressService } from '../../../../services/progress.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { ExternalLinkComponent } from '../../../shared/external-link/external-link.component';
import { AWS_SERVICES } from '../../../../data/aws-services.data';
import { AwsService, AwsCategory } from '../../../../models/aws.model';
import { ItemStatus } from '../../../../models/progress.model';

@Component({
  selector: 'app-aws-topic',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent, ExternalLinkComponent],
  template: `
    @if (service()) {
      <div class="aws-topic-page">
        <!-- Navigation -->
        <div class="top-nav">
          <a routerLink="/aws" class="back-link">Back to AWS</a>
          <div class="prev-next">
            @if (prevService()) {
              <a [routerLink]="'/aws/' + prevService()!.id" class="nav-link">Prev</a>
            }
            @if (nextService()) {
              <a [routerLink]="'/aws/' + nextService()!.id" class="nav-link">Next</a>
            }
          </div>
        </div>

        <!-- Header -->
        <div class="topic-header">
          <h1>{{ service()!.name }}</h1>
          <div class="header-badges">
            <span class="badge badge-category">{{ categoryLabel(service()!.category) }}</span>
            <app-status-badge
              [status]="topicStatus()"
              (statusChange)="cycleStatus()"
            />
          </div>
        </div>

        <!-- One-liner -->
        <div class="one-liner card-flat">
          {{ service()!.oneLiner }}
        </div>

        <!-- When to Use -->
        @if (service()!.whenToUse.length > 0) {
          <section class="content-section">
            <h2>When to Use</h2>
            <ul class="bullet-list">
              @for (item of service()!.whenToUse; track $index) {
                <li>{{ item }}</li>
              }
            </ul>
          </section>
        }

        <!-- Key Features -->
        @if (service()!.keyFeatures.length > 0) {
          <section class="content-section">
            <h2>Key Features</h2>
            <ul class="bullet-list">
              @for (feature of service()!.keyFeatures; track $index) {
                <li>{{ feature }}</li>
              }
            </ul>
          </section>
        }

        <!-- vs Alternatives -->
        @if (service()!.vsAlternatives.length > 0) {
          <section class="content-section">
            <h2>vs Alternatives</h2>
            <div class="comparison-grid">
              @for (comp of service()!.vsAlternatives; track comp.against) {
                <div class="comparison-card card-flat">
                  <div class="comp-header">vs {{ comp.against }}</div>
                  <p class="comp-criteria">{{ comp.criteria }}</p>
                </div>
              }
            </div>
          </section>
        }

        <!-- Interview Tips -->
        @if (service()!.interviewTips.length > 0) {
          <section class="content-section">
            <h2>Interview Tips</h2>
            <ul class="tip-list">
              @for (tip of service()!.interviewTips; track $index) {
                <li>{{ tip }}</li>
              }
            </ul>
          </section>
        }

        <!-- Resources -->
        @if (service()!.resources.length > 0) {
          <section class="content-section">
            <h2>Resources</h2>
            <div class="resources-row">
              @for (link of service()!.resources; track link.url) {
                <app-external-link [link]="link" />
              }
            </div>
          </section>
        }

        <!-- Bottom Navigation -->
        <div class="bottom-nav">
          <a routerLink="/aws" class="back-link">Back to AWS</a>
          <div class="prev-next">
            @if (prevService()) {
              <a [routerLink]="'/aws/' + prevService()!.id" class="nav-link">Prev: {{ prevService()!.name }}</a>
            }
            @if (nextService()) {
              <a [routerLink]="'/aws/' + nextService()!.id" class="nav-link">Next: {{ nextService()!.name }}</a>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .aws-topic-page { max-width: 860px; }
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
      margin-bottom: 24px;
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
    .one-liner {
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--color-text);
      padding: 16px 20px;
      margin-bottom: 28px;
      border-left: 3px solid var(--color-primary);
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
    .comparison-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }
    .comparison-card {
      padding: 14px 18px;
    }
    .comp-header {
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--color-primary);
      margin-bottom: 6px;
    }
    .comp-criteria {
      font-size: 0.85rem;
      line-height: 1.6;
      color: var(--color-text-secondary);
      margin: 0;
    }
    .tip-list {
      list-style: none;
      padding-left: 0;
    }
    .tip-list li {
      font-size: 0.88rem;
      line-height: 1.6;
      margin-bottom: 8px;
      padding: 10px 14px;
      background: var(--color-info-light);
      border-left: 3px solid var(--color-info);
      border-radius: var(--radius-sm);
      color: var(--color-text);
    }
    .resources-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `]
})
export class AwsTopicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private progressService = inject(ProgressService);

  service = signal<AwsService | null>(null);
  prevService = signal<AwsService | null>(null);
  nextService = signal<AwsService | null>(null);
  topicStatus = signal<ItemStatus>('not-started');

  private allServices = AWS_SERVICES;

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
    this.route.paramMap.subscribe(params => {
      const serviceId = params.get('serviceId') || '';
      this.loadService(serviceId);
    });
  }

  cycleStatus(): void {
    const s = this.service();
    if (!s) return;
    this.progressService.cycleItemStatus('aws', s.id, '_topic');
    this.topicStatus.set(this.progressService.getItemStatus('aws', s.id, '_topic'));
  }

  categoryLabel(cat: AwsCategory): string {
    return this.categoryLabels[cat] || cat;
  }

  private loadService(serviceId: string): void {
    const sorted = [...this.allServices].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(s => s.id === serviceId);
    if (idx === -1) return;

    this.service.set(sorted[idx]);
    this.prevService.set(idx > 0 ? sorted[idx - 1] : null);
    this.nextService.set(idx < sorted.length - 1 ? sorted[idx + 1] : null);
    this.topicStatus.set(this.progressService.getItemStatus('aws', serviceId, '_topic'));
  }
}
