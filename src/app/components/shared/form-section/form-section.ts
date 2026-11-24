import { Component, input } from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'app-form-section',
  standalone: true,
  imports: [Avatar, Card, Divider],
  host: { class: 'mb-6 block' },
  templateUrl: './form-section.html',
})
export class FormSection {
  readonly icon = input.required<string>();
  readonly heading = input.required<string>();
  readonly subheading = input<string>('');
}
