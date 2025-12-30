import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'primary-dark': 'var(--primary-dark)',
        secondary: 'var(--secondary)',
        'secondary-light': 'var(--secondary-light)',
        'secondary-dark': 'var(--secondary-dark)',
        verdigris: 'var(--verdigris)',
        'black-olive': 'var(--black-olive)',
        'satin-sheen-gold': 'var(--satin-sheen-gold)',
        seasalt: 'var(--seasalt)',
        'lavender-web': 'var(--lavender-web)',
      },
    },
  },
  plugins: [],
};

export default config;