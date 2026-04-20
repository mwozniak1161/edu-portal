import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Eduportal design tokens
        "edu-primary": "#3525cd",
        "edu-primary-container": "#4f46e5",
        "edu-primary-fixed": "#e2dfff",
        "edu-primary-fixed-dim": "#c3c0ff",
        "edu-on-primary": "#ffffff",
        "edu-on-primary-container": "#dad7ff",
        "edu-secondary": "#58579b",
        "edu-secondary-container": "#b6b4ff",
        "edu-on-secondary": "#ffffff",
        "edu-background": "#f8f9ff",
        "edu-surface": "#f8f9ff",
        "edu-surface-bright": "#f8f9ff",
        "edu-surface-dim": "#cbdbf5",
        "edu-surface-container-lowest": "#ffffff",
        "edu-surface-container-low": "#eff4ff",
        "edu-surface-container": "#e5eeff",
        "edu-surface-container-high": "#dce9ff",
        "edu-surface-container-highest": "#d3e4fe",
        "edu-surface-variant": "#d3e4fe",
        "edu-on-surface": "#0b1c30",
        "edu-on-surface-variant": "#464555",
        "edu-outline": "#777587",
        "edu-outline-variant": "#c7c4d8",
        "edu-inverse-surface": "#213145",
        "edu-inverse-on-surface": "#eaf1ff",
        "edu-error": "#ba1a1a",
        "edu-error-container": "#ffdad6",
      },
    },
  },
  plugins: [],
};

export default config;
