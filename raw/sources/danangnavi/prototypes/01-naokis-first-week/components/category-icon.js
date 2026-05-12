// CategoryIcon Component
// Lucide icon + label, grid cell with hover effect

const ICON_MAP = {
  food: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"/><path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"/></svg>`,
  housing: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  visa: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 12h4"/><path d="M10 16h4"/></svg>`,
  medical: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M12 10v4"/><path d="M10 12h4"/></svg>`,
  events: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>`,
  translation: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`,
};

export function renderCategoryIcon(container, { icon, label, href = '#' } = {}) {
  const cell = document.createElement('a');
  cell.href = href;
  cell.className = 'category-icon';
  cell.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    border-radius: var(--radius);
    cursor: pointer;
    text-decoration: none;
    transition: background-color var(--transition-normal), color var(--transition-normal);
  `;

  // Icon
  const iconEl = document.createElement('div');
  iconEl.innerHTML = ICON_MAP[icon] || ICON_MAP.food;
  iconEl.style.cssText = `
    color: var(--color-text);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--transition-normal);
  `;

  // Label
  const labelEl = document.createElement('span');
  labelEl.textContent = label || 'Category';
  labelEl.style.cssText = `
    font-family: var(--font-ui);
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-secondary);
    transition: color var(--transition-normal);
  `;

  cell.appendChild(iconEl);
  cell.appendChild(labelEl);

  // Hover
  cell.addEventListener('mouseenter', () => {
    cell.style.backgroundColor = 'rgba(46, 196, 182, 0.1)';
    iconEl.style.color = 'var(--color-accent)';
    labelEl.style.color = 'var(--color-accent)';
  });
  cell.addEventListener('mouseleave', () => {
    cell.style.backgroundColor = 'transparent';
    iconEl.style.color = 'var(--color-text)';
    labelEl.style.color = 'var(--color-text-secondary)';
  });

  container.appendChild(cell);
  return cell;
}
