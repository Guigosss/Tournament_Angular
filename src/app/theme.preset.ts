import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const TournamentPreset = definePreset(Aura, {

  semantic: {

    primary: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1',
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
      950: '#1E1B4B',
    },

    colorScheme: {
      dark: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#FFFFFF',
          hoverColor: '{primary.400}',
          activeColor: '{primary.300}',
        },

        surface: {
          0: '#FFFFFF',
          50: '#F4F6FB',
          100: '#E6EAF3',
          200: '#CBD2E3',
          300: '#A6B0C8',
          400: '#8590AB',
          500: '#66718C',
          600: '#4A5470',
          700: '#323B54',
          800: '#212940',
          900: '#151B2E',
          950: '#0C101D',
        },
      },
    },

    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.400}',
      offset: '2px',
    },
  },

  //- PrimeNG components
  components: {
    card: {
      body: {
        padding: '1.5rem',
        gap: '0.5rem',
      },
      colorScheme: {
        dark: {
          root: { color: '{surface.100}' },
        },
      },
    },
  },

});
