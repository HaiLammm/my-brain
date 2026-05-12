// SectionHeader Component
// Section title + optional "View all" link

export function renderSectionHeader(container, { title, linkText = null, linkHref = null } = {}) {
  const header = document.createElement('div');
  header.className = 'section-header';
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  `;

  // Title
  const titleEl = document.createElement('h2');
  titleEl.textContent = title || 'Section';
  titleEl.style.cssText = `
    font-family: var(--font-headlines);
    font-size: var(--text-h2);
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
  `;

  header.appendChild(titleEl);

  // Link
  if (linkText) {
    const link = document.createElement('a');
    link.href = linkHref || '#';
    link.textContent = linkText;
    link.style.cssText = `
      font-family: var(--font-ui);
      font-size: 14px;
      font-weight: 500;
      color: var(--color-accent);
      text-decoration: none;
      transition: text-decoration var(--transition-fast);
      white-space: nowrap;
    `;
    link.addEventListener('mouseenter', () => { link.style.textDecoration = 'underline'; });
    link.addEventListener('mouseleave', () => { link.style.textDecoration = 'none'; });
    header.appendChild(link);
  }

  container.appendChild(header);
  console.log('[SectionHeader] Rendered:', title);
  return header;
}
