import { Injectable, signal, computed } from '@angular/core';
import { ItemStatus, ProgressStore, Section, SectionProgress } from '../models/progress.model';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly STORAGE_KEY = 'interview-prep-progress';
  private readonly CURRENT_VERSION = 1;

  private store = signal<ProgressStore>(this.loadOrInit());

  private sectionMeta: Record<Section, { label: string; icon: string }> = {
    'dsa': { label: 'DSA Patterns', icon: '{}' },
    'system-design': { label: 'System Design', icon: '☁' },
    'devops': { label: 'DevOps', icon: '⚙' },
    'aws': { label: 'AWS', icon: '△' },
    'observability': { label: 'Observability', icon: '◎' },
    'golang': { label: 'Golang', icon: 'Go' },
    'queues': { label: 'Queues (Kafka)', icon: '⇶' },
    'caching': { label: 'Caching (Redis)', icon: '⚡' },
    'java': { label: 'Java & Spring', icon: '☕' }
  };

  // --- Item Status ---
  getItemStatus(section: Section, topicId: string, itemId: string): ItemStatus {
    const key = `${section}:${topicId}:${itemId}`;
    return this.store().items[key] || 'not-started';
  }

  setItemStatus(section: Section, topicId: string, itemId: string, status: ItemStatus): void {
    const s = { ...this.store() };
    s.items = { ...s.items, [`${section}:${topicId}:${itemId}`]: status };
    s.lastUpdated = new Date().toISOString();
    this.store.set(s);
    this.persist();
  }

  cycleItemStatus(section: Section, topicId: string, itemId: string): void {
    const order: ItemStatus[] = ['not-started', 'in-progress', 'completed', 'needs-review'];
    const current = this.getItemStatus(section, topicId, itemId);
    const next = order[(order.indexOf(current) + 1) % order.length];
    this.setItemStatus(section, topicId, itemId, next);
  }

  // --- Schedule ---
  isTaskChecked(key: string): boolean {
    return this.store().schedule[key] || false;
  }

  toggleTask(key: string): void {
    const s = { ...this.store() };
    s.schedule = { ...s.schedule, [key]: !s.schedule[key] };
    s.lastUpdated = new Date().toISOString();
    this.store.set(s);
    this.persist();
  }

  // --- Notes ---
  getNote(section: Section, topicId: string, itemId: string): string {
    return this.store().notes[`${section}:${topicId}:${itemId}`] || '';
  }

  setNote(section: Section, topicId: string, itemId: string, note: string): void {
    const s = { ...this.store() };
    s.notes = { ...s.notes, [`${section}:${topicId}:${itemId}`]: note };
    s.lastUpdated = new Date().toISOString();
    this.store.set(s);
    this.persist();
  }

  // --- Progress Computation ---
  getSectionProgress(section: Section): SectionProgress {
    const items = this.store().items;
    const prefix = `${section}:`;
    let total = 0, completed = 0, inProgress = 0, needsReview = 0;

    for (const [key, status] of Object.entries(items)) {
      if (key.startsWith(prefix)) {
        total++;
        if (status === 'completed') completed++;
        else if (status === 'in-progress') inProgress++;
        else if (status === 'needs-review') needsReview++;
      }
    }

    return {
      section,
      label: this.sectionMeta[section].label,
      icon: this.sectionMeta[section].icon,
      total,
      completed,
      inProgress,
      needsReview,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }

  getOverallProgress(): { total: number; completed: number; percentage: number } {
    const sections: Section[] = ['dsa', 'system-design', 'devops', 'aws', 'observability', 'golang', 'queues', 'caching', 'java'];
    let total = 0, completed = 0;
    for (const s of sections) {
      const p = this.getSectionProgress(s);
      total += p.total;
      completed += p.completed;
    }
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }

  getWeekProgress(week: number): { total: number; checked: number; percentage: number } {
    const schedule = this.store().schedule;
    const prefix = `week-${week}:`;
    let total = 0, checked = 0;
    for (const [key, val] of Object.entries(schedule)) {
      if (key.startsWith(prefix)) {
        total++;
        if (val) checked++;
      }
    }
    return { total, checked, percentage: total > 0 ? Math.round((checked / total) * 100) : 0 };
  }

  // --- Initialize trackable items (called from data files) ---
  initializeItems(section: Section, items: { topicId: string; itemId: string }[]): void {
    const s = { ...this.store() };
    let changed = false;
    for (const item of items) {
      const key = `${section}:${item.topicId}:${item.itemId}`;
      if (!(key in s.items)) {
        s.items = { ...s.items, [key]: 'not-started' };
        changed = true;
      }
    }
    if (changed) {
      this.store.set(s);
      this.persist();
    }
  }

  initializeSchedule(keys: string[]): void {
    const s = { ...this.store() };
    let changed = false;
    for (const key of keys) {
      if (!(key in s.schedule)) {
        s.schedule = { ...s.schedule, [key]: false };
        changed = true;
      }
    }
    if (changed) {
      this.store.set(s);
      this.persist();
    }
  }

  // --- Export/Import ---
  exportProgress(): string {
    return JSON.stringify(this.store(), null, 2);
  }

  importProgress(json: string): boolean {
    try {
      const data = JSON.parse(json) as ProgressStore;
      if (data.version && data.items && data.schedule) {
        this.store.set(data);
        this.persist();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  resetAll(): void {
    const fresh = this.createDefault();
    this.store.set(fresh);
    this.persist();
  }

  // --- Persistence ---
  private persist(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.store()));
  }

  private loadOrInit(): ProgressStore {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as ProgressStore;
        if (data.version === this.CURRENT_VERSION) return data;
      }
    } catch {}
    return this.createDefault();
  }

  private createDefault(): ProgressStore {
    return {
      version: this.CURRENT_VERSION,
      lastUpdated: new Date().toISOString(),
      items: {},
      schedule: {},
      notes: {}
    };
  }
}
