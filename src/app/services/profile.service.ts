import { Injectable, signal } from '@angular/core';
import { Section } from '../models/progress.model';

export interface UserProfile {
  name: string;
  enabledSections: Section[];
  knownSections: Section[];
  sidebarCollapsed: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly STORAGE_KEY = 'interview-prep-profile';

  private readonly allSections: { section: Section; label: string }[] = [
    { section: 'dsa', label: 'DSA Patterns' },
    { section: 'system-design', label: 'System Design' },
    { section: 'devops', label: 'DevOps' },
    { section: 'aws', label: 'AWS' },
    { section: 'observability', label: 'Observability' },
    { section: 'golang', label: 'Golang' },
    { section: 'queues', label: 'Queues (Kafka)' },
    { section: 'caching', label: 'Caching (Redis)' },
    { section: 'java', label: 'Java & Spring' },
  ];

  profile = signal<UserProfile>(this.load());

  getAllSections() {
    return this.allSections;
  }

  isSectionEnabled(section: Section): boolean {
    return this.profile().enabledSections.includes(section);
  }

  toggleSection(section: Section): void {
    const current = this.profile();
    const enabled = current.enabledSections.includes(section)
      ? current.enabledSections.filter(s => s !== section)
      : [...current.enabledSections, section];
    this.update({ ...current, enabledSections: enabled });
  }

  setName(name: string): void {
    this.update({ ...this.profile(), name });
  }

  toggleSidebar(): void {
    this.update({ ...this.profile(), sidebarCollapsed: !this.profile().sidebarCollapsed });
  }

  isCollapsed(): boolean {
    return this.profile().sidebarCollapsed;
  }

  private update(profile: UserProfile): void {
    this.profile.set(profile);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
  }

  private load(): UserProfile {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as UserProfile;
        if (data.enabledSections) {
          const allSectionIds = this.allSections.map(s => s.section);
          const known = data.knownSections || data.enabledSections;

          // Only auto-enable sections that are truly NEW (not known yet)
          // If user disabled a section, it's in knownSections but not enabledSections — leave it disabled
          for (const sec of allSectionIds) {
            if (!known.includes(sec)) {
              data.enabledSections.push(sec);
            }
          }

          // Update knownSections to all current sections
          data.knownSections = [...allSectionIds];

          // Persist the migrated data
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
          return data;
        }
      }
    } catch {}
    return this.createDefault();
  }

  private createDefault(): UserProfile {
    const allIds = this.allSections.map(s => s.section);
    return {
      name: '',
      enabledSections: [...allIds],
      knownSections: [...allIds],
      sidebarCollapsed: false,
    };
  }
}
