/**
 * Accessibility Utilities for OS Play Lab
 * Provides tools for checking and improving accessibility
 */

/**
 * Calculate contrast ratio between two colors
 * @param foreground - Foreground color in hex or rgb
 * @param background - Background color in hex or rgb
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(foreground: string, background: string): number {
  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Get relative luminance of a color
 * @param color - Color in hex or rgb format
 * @returns Relative luminance (0-1)
 */
function getLuminance(color: string): number {
  const rgb = parseColor(color);
  const [r, g, b] = rgb.map(val => {
    const srgb = val / 255;
    return srgb <= 0.03928 
      ? srgb / 12.92 
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Parse color string to RGB array
 * @param color - Color in hex or rgb format
 * @returns [r, g, b] array
 */
function parseColor(color: string): [number, number, number] {
  // Remove # if present
  color = color.replace('#', '');
  
  // Handle 3-character hex
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  
  // Parse hex
  if (color.length === 6) {
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    return [r, g, b];
  }
  
  // Handle rgb/rgba format
  const match = color.match(/\d+/g);
  if (match && match.length >= 3) {
    return [
      parseInt(match[0]),
      parseInt(match[1]),
      parseInt(match[2])
    ];
  }
  
  // Default to black if parsing fails
  return [0, 0, 0];
}

/**
 * Check if contrast ratio meets WCAG standards
 * @param ratio - Contrast ratio
 * @param level - WCAG level ('AA' or 'AAA')
 * @param size - Text size ('normal' or 'large')
 * @returns Whether the ratio meets the standard
 */
export function meetsWCAG(
  ratio: number, 
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Get WCAG compliance level for a contrast ratio
 * @param ratio - Contrast ratio
 * @param size - Text size
 * @returns Compliance level
 */
export function getWCAGLevel(
  ratio: number,
  size: 'normal' | 'large' = 'normal'
): 'AAA' | 'AA' | 'fail' {
  if (meetsWCAG(ratio, 'AAA', size)) return 'AAA';
  if (meetsWCAG(ratio, 'AA', size)) return 'AA';
  return 'fail';
}

/**
 * Announce message to screen readers
 * @param message - Message to announce
 * @param priority - Announcement priority
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check if element is keyboard accessible
 * @param element - DOM element to check
 * @returns Whether element is keyboard accessible
 */
export function isKeyboardAccessible(element: HTMLElement): boolean {
  const tabIndex = element.tabIndex;
  const isInteractive = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(
    element.tagName
  );
  
  return tabIndex >= 0 || (isInteractive && tabIndex !== -1);
}

/**
 * Add skip link to page
 * @param targetId - ID of main content element
 */
export function addSkipLink(targetId: string = 'main-content'): void {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.setAttribute('aria-label', 'Skip to main content');
  
  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Trap focus within a container (for modals, dialogs)
 * @param container - Container element
 * @returns Cleanup function
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };
  
  container.addEventListener('keydown', handleTabKey);
  firstElement?.focus();
  
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Check for common accessibility issues
 * @returns Array of issues found
 */
export function checkAccessibility(): string[] {
  const issues: string[] = [];
  
  // Check for images without alt text
  const images = document.querySelectorAll('img:not([alt])');
  if (images.length > 0) {
    issues.push(`Found ${images.length} images without alt text`);
  }
  
  // Check for buttons without accessible names
  const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
  buttons.forEach(button => {
    if (!button.textContent?.trim()) {
      issues.push('Found button without accessible name');
    }
  });
  
  // Check for form inputs without labels
  const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (!label) {
        issues.push(`Found input without associated label: ${id}`);
      }
    }
  });
  
  // Check for heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.substring(1));
    if (level - lastLevel > 1) {
      issues.push(`Heading hierarchy skip: ${heading.tagName} after h${lastLevel}`);
    }
    lastLevel = level;
  });
  
  return issues;
}

/**
 * Format keyboard shortcut for display
 * @param keys - Array of keys or string with + separator
 * @returns Formatted shortcut elements
 */
export function formatShortcut(keys: string | string[]): string {
  const keyArray = typeof keys === 'string' ? keys.split('+') : keys;
  return keyArray.map(key => key.trim()).join(' + ');
}

export default {
  getContrastRatio,
  meetsWCAG,
  getWCAGLevel,
  announceToScreenReader,
  isKeyboardAccessible,
  addSkipLink,
  trapFocus,
  checkAccessibility,
  formatShortcut,
};
