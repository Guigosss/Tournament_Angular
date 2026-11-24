import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TournamentStatus } from '../../../models/tournament.enums';
import { humanize, STATUS_SEVERITY } from '../../../utils/tournament-display';

@Component({
  selector: 'app-tournament-filters',
  imports: [FormsModule, IconField, InputIcon, InputText, Select],
  host: { class: 'mb-6 flex flex-col gap-3 sm:flex-row' },
  templateUrl: './tournament-filters.html',
})
export class TournamentFilters {
  readonly search = model('');
  readonly status = model<TournamentStatus | null>(null);

  readonly statusOptions = (Object.keys(STATUS_SEVERITY) as TournamentStatus[]).map(
    (status) => ({ label: humanize(status), value: status }),
  );
}
