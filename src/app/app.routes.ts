import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard'
  },
  {
    path: 'schedule',
    loadComponent: () => import('./components/pages/schedule/schedule.component').then(m => m.ScheduleComponent),
    title: 'Weekly Schedule'
  },
  {
    path: 'dsa',
    loadComponent: () => import('./components/pages/dsa/dsa-list/dsa-list.component').then(m => m.DsaListComponent),
    title: 'DSA Patterns'
  },
  {
    path: 'dsa/:patternId',
    loadComponent: () => import('./components/pages/dsa/dsa-pattern/dsa-pattern.component').then(m => m.DsaPatternComponent),
    title: 'DSA Pattern'
  },
  {
    path: 'system-design',
    loadComponent: () => import('./components/pages/system-design/sd-list/sd-list.component').then(m => m.SdListComponent),
    title: 'System Design'
  },
  {
    path: 'system-design/:topicId',
    loadComponent: () => import('./components/pages/system-design/sd-topic/sd-topic.component').then(m => m.SdTopicComponent),
    title: 'System Design Topic'
  },
  {
    path: 'devops',
    loadComponent: () => import('./components/pages/devops/devops-list/devops-list.component').then(m => m.DevopsListComponent),
    title: 'DevOps'
  },
  {
    path: 'devops/:topicId',
    loadComponent: () => import('./components/pages/devops/devops-topic/devops-topic.component').then(m => m.DevopsTopicComponent),
    title: 'DevOps Topic'
  },
  {
    path: 'aws',
    loadComponent: () => import('./components/pages/aws/aws-list/aws-list.component').then(m => m.AwsListComponent),
    title: 'AWS Services'
  },
  {
    path: 'aws/:serviceId',
    loadComponent: () => import('./components/pages/aws/aws-topic/aws-topic.component').then(m => m.AwsTopicComponent),
    title: 'AWS Service'
  },
  {
    path: 'observability',
    loadComponent: () => import('./components/pages/observability/obs-list/obs-list.component').then(m => m.ObsListComponent),
    title: 'Observability'
  },
  {
    path: 'observability/:topicId',
    loadComponent: () => import('./components/pages/observability/obs-topic/obs-topic.component').then(m => m.ObsTopicComponent),
    title: 'Observability Topic'
  },
  {
    path: 'golang',
    loadComponent: () => import('./components/pages/golang/golang-list/golang-list.component').then(m => m.GolangListComponent),
    title: 'Golang'
  },
  {
    path: 'golang/:topicId',
    loadComponent: () => import('./components/pages/golang/golang-topic/golang-topic.component').then(m => m.GolangTopicComponent),
    title: 'Golang Topic'
  },
  {
    path: 'queues',
    loadComponent: () => import('./components/pages/queues/queue-list/queue-list.component').then(m => m.QueueListComponent),
    title: 'Queues (Kafka)'
  },
  {
    path: 'queues/:topicId',
    loadComponent: () => import('./components/pages/queues/queue-topic/queue-topic.component').then(m => m.QueueTopicComponent),
    title: 'Queue Topic'
  },
  {
    path: 'caching',
    loadComponent: () => import('./components/pages/caching/cache-list/cache-list.component').then(m => m.CacheListComponent),
    title: 'Caching (Redis)'
  },
  {
    path: 'caching/:topicId',
    loadComponent: () => import('./components/pages/caching/cache-topic/cache-topic.component').then(m => m.CacheTopicComponent),
    title: 'Caching Topic'
  },
  {
    path: 'java',
    loadComponent: () => import('./components/pages/java/java-list/java-list.component').then(m => m.JavaListComponent),
    title: 'Java & Spring'
  },
  {
    path: 'java/:topicId',
    loadComponent: () => import('./components/pages/java/java-topic/java-topic.component').then(m => m.JavaTopicComponent),
    title: 'Java Topic'
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/pages/settings/settings.component').then(m => m.SettingsComponent),
    title: 'Settings'
  },
  { path: '**', redirectTo: 'dashboard' }
];
