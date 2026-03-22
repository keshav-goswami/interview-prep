import { Pipe, PipeTransform } from '@angular/core';
import { ItemStatus } from '../models/progress.model';

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
  private labels: Record<ItemStatus, string> = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'needs-review': 'Needs Review'
  };

  transform(value: ItemStatus): string {
    return this.labels[value] || value;
  }
}
