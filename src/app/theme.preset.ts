import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const TournamentPreset = definePreset(Aura, {

  semantic: {

    // Primary palette
    primary: {
      50: '#f9edff',
      100: '#f0d5ff',
      200: '#e3b0ff',
      300: '#d58aff',
      400: '#c45cf5',
      500: '#a83bd8',
      600: '#8d28b9',
      700: '#7020a0',
      800: '#571a7c',
      900: '#40135c',
      950: '#270a39',

      color: '#a83bd8',
      contrastColor: '#ffffff',
      hoverColor: '#c45cf5',
      activeColor: '#8d28b9'
    },

    // Dark mode
    colorScheme: {
      dark: {
        primary: {
          color: '#c45cf5',
          contrastColor: '#21132d',
          hoverColor: '#d58aff',
          activeColor: '#a83bd8'
        },

        surface: {
          0: '#ffffff',
          50: '#f5eff9',
          100: '#e9dff0',
          200: '#cdbbd9',
          300: '#a995b8',
          400: '#887398',
          500: '#6d587d',
          600: '#51415f',
          700: '#392d45',
          800: '#2b2135',
          900: '#211a29',
          950: '#17111e'
        },

        highlight: {
          background: '#7020a0',
          focusBackground: '#8d28b9',
          color: '#ffffff',
          focusColor: '#ffffff'
        }
      }
    },

    // Global focus
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '#c45cf5',
      offset: '2px'
    }
  },

  // PrimeNG components
  components: {
    card: {
      colorScheme: {
        dark: {
          root: {
            background: 'linear-gradient(to bottom right, #7020A0 0%, #35134F 50%, #211A29 100%)',
            color: '#ffffff'
          },
          body: {
            padding: '1.5rem',
            gap: '0.5rem'
          }
        }
      }
    }
  }

});
