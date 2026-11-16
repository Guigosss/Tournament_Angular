import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tournament-schedule',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tournament-schedule.html',
  styleUrl: './tournament-schedule.css',
})
export class TournamentSchedule {
  form = input.required<FormGroup>();
}
