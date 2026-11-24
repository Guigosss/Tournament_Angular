import { Component, input } from '@angular/core';

@Component({
  selector: 'app-meta-item',
  host: { class: 'flex items-center gap-2' },
  templateUrl: './meta-item.html',
})
export class MetaItem {
  readonly icon = input.required<string>();
}
