import { withAccountKitUi, createColorSet } from "@account-kit/react/tailwind";
import type { Config } from "tailwindcss";

// Wrap your existing Tailwind config with Alchemy's UI wrapper
// This adds Alchemy's modal styles without affecting your app styles
export default withAccountKitUi(
  {
    // Your existing Tailwind config
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
  } as Config,
  {
    // Summit Bullion brand theme for Alchemy modal
    colors: {
      // Primary button (Continue button) - Black with gold hover
      "btn-primary": createColorSet("#141722", "#141722"),
      
      // Secondary button (Skip button) - Light gray with dark text
      "btn-secondary": createColorSet("#f3f4f6", "#f3f4f6"),
      
      // Social buttons (Google) - White background, gray border like inputs
      "btn-auth": createColorSet("#FFFFFF", "#FFFFFF"),
      
      // Background colors - Clean white modal
      "bg-surface-default": createColorSet("#FFFFFF", "#FFFFFF"),
      "bg-surface-error": createColorSet("#fff5f5", "#fff5f5"),
      "bg-surface-success": createColorSet("#f0fdf4", "#f0fdf4"),
      "bg-surface-warning": createColorSet("#fffbeb", "#fffbeb"),
      "bg-surface-inset": createColorSet("#FFFFFF", "#FFFFFF"),
      
      // Text colors
      "fg-primary": createColorSet("#141722", "#141722"), // Summit's dark text
      "fg-secondary": createColorSet("#7c7c7c", "#7c7c7c"),
      "fg-tertiary": createColorSet("#a3a3a3", "#a3a3a3"),
      "fg-invert": createColorSet("#FFFFFF", "#FFFFFF"),
      "fg-accent-brand": createColorSet("#FFB546", "#FFB546"), // Gold accent
      "fg-critical": createColorSet("#dc2626", "#dc2626"),
      
      // Border colors - Using Alchemy's naming convention
      "static": createColorSet("rgba(188, 188, 188, 0.6)", "rgba(188, 188, 188, 0.6)"), // Soft border when not focused
      "active": createColorSet("#FFB546", "#FFB546"), // Gold border when focused!
      "critical": createColorSet("#dc2626", "#dc2626"), // Error state
    },
    borderRadius: "lg", // 24px - Rounded corners for all components
  }
);

