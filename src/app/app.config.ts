
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';
import { authInterceptor } from './services/auth-interceptor';
import { TournamentPreset } from './theme.preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    MessageService,

    provideRouter(routes),

    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    providePrimeNG({
      license: 'eyJpZCI6ImJkZjI1YWQyLWUzNTAtNDhlOC05ZjE3LTc3NDA5NTY4NjJmNiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTM5NTQwMjgsImV4cCI6MTgyNTQ5MDAyOH0.JmafGi9_4MeMed7IrZr1niLccc9jn87MavWEy3sunfkb8ztAY7wd-eLlDVVemUgwc_amtnGq7egvAcJOvSiKBQ',
      theme: {
        preset: TournamentPreset,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
  ],
};
