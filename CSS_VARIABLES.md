# 🎨 CSS Variables System Documentation

## 📋 Overview

This document describes the comprehensive CSS variables system used throughout the CoinGecko application for consistent theming and styling.

## 🌈 **Color System**

### **Light Theme (Default)**

```css
:root {
  /* Primary Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-card: #f8fafc;
  --bg-overlay: rgba(0, 0, 0, 0.1);

  /* Text Colors */
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --text-inverse: #ffffff;

  /* Border Colors */
  --border-color: #e2e8f0;
  --border-hover: #cbd5e1;
  --border-focus: #3b82f6;

  /* Accent Colors */
  --accent-primary: #3b82f6;
  --accent-secondary: #10b981;
  --accent-warning: #f59e0b;
  --accent-danger: #ef4444;
  --accent-success: #22c55e;

  /* Status Colors */
  --status-positive: #10b981;
  --status-negative: #ef4444;
  --status-neutral: #6b7280;
  --status-warning: #f59e0b;
}
```

### **Dark Theme**

```css
[data-theme="dark"] {
  /* Primary Colors */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #1e293b;
  --bg-overlay: rgba(255, 255, 255, 0.1);

  /* Text Colors */
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --text-inverse: #0f172a;

  /* Border Colors */
  --border-color: #334155;
  --border-hover: #475569;
  --border-focus: #60a5fa;

  /* Accent Colors */
  --accent-primary: #60a5fa;
  --accent-secondary: #34d399;
  --accent-warning: #fbbf24;
  --accent-danger: #f87171;
  --accent-success: #4ade80;

  /* Status Colors */
  --status-positive: #34d399;
  --status-negative: #f87171;
  --status-neutral: #9ca3af;
  --status-warning: #fbbf24;
}
```

## 🎯 **Component-Specific Variables**

### **Button Variables**

```css
:root {
  /* Button Primary */
  --btn-primary-bg: var(--accent-primary);
  --btn-primary-text: var(--text-inverse);
  --btn-primary-hover: #2563eb;
  --btn-primary-active: #1d4ed8;

  /* Button Secondary */
  --btn-secondary-bg: var(--bg-secondary);
  --btn-secondary-text: var(--text-primary);
  --btn-secondary-hover: var(--border-hover);
  --btn-secondary-active: var(--border-color);

  /* Button Danger */
  --btn-danger-bg: var(--accent-danger);
  --btn-danger-text: var(--text-inverse);
  --btn-danger-hover: #dc2626;
  --btn-danger-active: #b91c1c;
}
```

### **Card Variables**

```css
:root {
  /* Card Styling */
  --card-bg: var(--bg-card);
  --card-border: var(--border-color);
  --card-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --card-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Card Hover Effects */
  --card-hover-lift: translateY(-2px);
  --card-hover-scale: scale(1.02);
  --card-hover-glow: 0 0 20px rgba(59, 130, 246, 0.3);
}
```

### **Input Variables**

```css
:root {
  /* Input Styling */
  --input-bg: var(--bg-primary);
  --input-border: var(--border-color);
  --input-border-focus: var(--border-focus);
  --input-text: var(--text-primary);
  --input-placeholder: var(--text-muted);

  /* Input States */
  --input-hover-border: var(--border-hover);
  --input-focus-ring: 0 0 0 3px rgba(59, 130, 246, 0.1);
  --input-error-border: var(--accent-danger);
  --input-success-border: var(--accent-success);
}
```

## 📱 **Responsive Variables**

### **Breakpoint Variables**

```css
:root {
  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;

  /* Container Max Widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}
```

### **Spacing Variables**

```css
:root {
  /* Base Spacing Unit */
  --spacing-unit: 4px;

  /* Spacing Scale */
  --spacing-1: calc(var(--spacing-unit) * 1); /* 4px */
  --spacing-2: calc(var(--spacing-unit) * 2); /* 8px */
  --spacing-3: calc(var(--spacing-unit) * 3); /* 12px */
  --spacing-4: calc(var(--spacing-unit) * 4); /* 16px */
  --spacing-5: calc(var(--spacing-unit) * 5); /* 20px */
  --spacing-6: calc(var(--spacing-unit) * 6); /* 24px */
  --spacing-8: calc(var(--spacing-unit) * 8); /* 32px */
  --spacing-10: calc(var(--spacing-unit) * 10); /* 40px */
  --spacing-12: calc(var(--spacing-unit) * 12); /* 48px */
  --spacing-16: calc(var(--spacing-unit) * 16); /* 64px */
  --spacing-20: calc(var(--spacing-unit) * 20); /* 80px */
  --spacing-24: calc(var(--spacing-unit) * 24); /* 96px */
}
```

## 🎭 **Animation Variables**

### **Transition Variables**

```css
:root {
  /* Transition Durations */
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  --transition-slow: 500ms;

  /* Transition Easing */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Common Transitions */
  --transition-all: all var(--transition-normal) var(--ease-in-out);
  --transition-colors: color var(--transition-fast) var(--ease-out), background-color
      var(--transition-fast) var(--ease-out),
    border-color var(--transition-fast) var(--ease-out);
  --transition-transform: transform var(--transition-normal) var(--ease-out);
  --transition-opacity: opacity var(--transition-fast) var(--ease-out);
}
```

### **Animation Variables**

```css
:root {
  /* Animation Durations */
  --animation-spin: 1s;
  --animation-pulse: 2s;
  --animation-bounce: 1s;
  --animation-fade-in: 0.3s;
  --animation-slide-in: 0.4s;

  /* Animation Delays */
  --delay-fast: 100ms;
  --delay-normal: 200ms;
  --delay-slow: 500ms;

  /* Stagger Delays */
  --stagger-1: 0ms;
  --stagger-2: var(--delay-fast);
  --stagger-3: calc(var(--delay-fast) * 2);
  --stagger-4: calc(var(--delay-fast) * 3);
}
```

## 🔧 **Utility Variables**

### **Shadow Variables**

```css
:root {
  /* Shadow System */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  /* Colored Shadows */
  --shadow-blue: 0 0 20px rgba(59, 130, 246, 0.3);
  --shadow-green: 0 0 20px rgba(16, 185, 129, 0.3);
  --shadow-red: 0 0 20px rgba(239, 68, 68, 0.3);
  --shadow-yellow: 0 0 20px rgba(245, 158, 11, 0.3);
}
```

### **Border Radius Variables**

```css
:root {
  /* Border Radius Scale */
  --radius-none: 0;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Component-Specific Radius */
  --radius-button: var(--radius-lg);
  --radius-card: var(--radius-xl);
  --radius-input: var(--radius-md);
  --radius-modal: var(--radius-2xl);
}
```

## 📐 **Layout Variables**

### **Grid Variables**

```css
:root {
  /* Grid System */
  --grid-columns: 12;
  --grid-gap: var(--spacing-4);
  --grid-gap-sm: var(--spacing-2);
  --grid-gap-lg: var(--spacing-6);
  --grid-gap-xl: var(--spacing-8);

  /* Container Padding */
  --container-padding: var(--spacing-4);
  --container-padding-sm: var(--spacing-2);
  --container-padding-lg: var(--spacing-6);
  --container-padding-xl: var(--spacing-8);
}
```

### **Z-Index Variables**

```css
:root {
  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-toast: 1080;
}
```

## 🎨 **Usage Examples**

### **Component Styling**

```jsx
// Using CSS variables in React components
const MyComponent = () => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        transition: "var(--transition-all)",
      }}
    >
      Content
    </div>
  );
};
```

### **Dynamic Theming**

```jsx
// Switching themes dynamically
const toggleTheme = () => {
  const root = document.documentElement;
  const currentTheme = root.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", newTheme);
};
```

### **CSS Custom Properties**

```css
/* Using variables in CSS */
.my-component {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  transition: var(--transition-all);
}

.my-component:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-lg);
  transform: var(--card-hover-lift);
}
```

## 🔄 **Theme Switching**

### **Automatic Theme Detection**

```css
/* System preference detection */
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }
}

/* Manual theme override */
[data-theme="dark"] {
  color-scheme: dark;
}

[data-theme="light"] {
  color-scheme: light;
}
```

### **Theme Persistence**

```javascript
// Save theme preference
const saveTheme = (theme) => {
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
};

// Load saved theme
const loadTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  return savedTheme || systemTheme;
};
```

## 📱 **Responsive Design**

### **Media Query Variables**

```css
/* Using CSS variables in media queries */
@media (min-width: var(--breakpoint-md)) {
  .responsive-component {
    padding: var(--spacing-6);
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: var(--breakpoint-lg)) {
  .responsive-component {
    padding: var(--spacing-8);
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 🎯 **Best Practices**

### **Variable Naming**

- Use descriptive names: `--bg-card` not `--bg1`
- Group related variables: `--shadow-*`, `--radius-*`
- Use consistent prefixes: `--btn-*`, `--card-*`
- Avoid magic numbers: use `--spacing-4` not `16px`

### **Fallback Values**

```css
/* Always provide fallbacks */
.my-component {
  background-color: var(--bg-card, #f8fafc);
  color: var(--text-primary, #1e293b);
}
```

### **Performance Considerations**

- CSS variables are computed at runtime
- Use sparingly for frequently changing values
- Consider CSS custom properties for static values
- Test performance on lower-end devices

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: ✅ Complete






