import { Component, input } from '@angular/core';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'app-empty-state',
  imports: [Avatar],
  host: { class: 'empty-box' },
  templateUrl: './empty-state.html',
})
export class EmptyState {
  readonly icon = input.required<string>();
  readonly heading = input.required<string>();
  readonly message = input<string>('');
}
