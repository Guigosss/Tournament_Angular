
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const SchtroumpfPreset = definePreset(Aura, {

  // Couleurs personnalisées
  extend: {
    smurf: {
      50: '#EFF8FF',
      100: '#DCEEFF',
      200: '#B9DEFF',
      300: '#82C4FF',
      400: '#49A5F5',
      500: '#1685E5',
      600: '#0868C4',
      700: '#07529B',
      800: '#073F75',
      900: '#082F55',
      950: '#041B35'
    },

    mushroom: {
      50: '#FFFDF7',
      100: '#F8F0DE',
      200: '#F2E5C8',
      300: '#E8D4A9',
      400: '#D9BB83',
      500: '#C6A36A'
    },

    schtroumpf: {
      red: '#E94B50',
      green: '#8BCB69'
    }
  },

  // Configuration sémantique
  semantic: {
    primary: {
      50: '{smurf.50}',
      100: '{smurf.100}',
      200: '{smurf.200}',
      300: '{smurf.300}',
      400: '{smurf.400}',
      500: '{smurf.500}',
      600: '{smurf.600}',
      700: '{smurf.700}',
      800: '{smurf.800}',
      900: '{smurf.900}',
      950: '{smurf.950}'
    },

    colorScheme: {
      light: {
        surface: {
          0: '#FFFFFF',
          50: '#F8FBFF',
          100: '#EFF8FF',
          200: '#DCEEFF',
          300: '#B9DEFF',
          400: '#82C4FF',
          500: '#6B9BC4',
          600: '#547A9D',
          700: '#3D5D7C',
          800: '#29445F',
          900: '#172D43',
          950: '#0B1929'
        }
      }
    },

    typography: {
      fontFamily: 'Nunito, sans-serif',
      fontWeight: '500'
    },

    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px'
    }
  },

  // Personnalisation des composants
  components: {
    button: {
      root: {
        borderRadius: '12px',
        label: {
          fontWeight: '700'
        }
      }
    },

    card: {
      root: {
        borderRadius: '18px'
      }
    },

    inputtext: {
      root: {
        borderRadius: '10px'
      }
    },

    dialog: {
      root: {
        borderRadius: '20px'
      }
    }
  },

  // Styles CSS additionnels
  css: `
    :root {
      --smurf-blue: #1685E5;
      --smurf-red: #E94B50;
      --smurf-green: #8BCB69;
      --mushroom-beige: #F2E5C8;
    }

    body {
      font-family: 'Nunito', sans-serif;
      background-color: #F8FBFF;
    }

    .p-button {
      font-weight: 700;
    }

    .p-card {
      box-shadow: 0 4px 14px rgba(8, 104, 196, 0.08);
    }
  `
});

export default SchtroumpfPreset;
