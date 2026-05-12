// DualCurrencyPrice Component
// VND amount + JPY equivalent display

export function renderDualCurrencyPrice(container, { vnd, jpy, suffix = null, size = 'md' } = {}) {
  const wrapper = document.createElement('span');
  wrapper.className = 'dual-currency-price';
  wrapper.style.cssText = 'display: inline-flex; align-items: baseline; gap: 6px; flex-wrap: wrap;';

  const sizes = {
    sm: { vnd: '14px', jpy: '12px' },
    md: { vnd: '18px', jpy: '14px' },
    lg: { vnd: '24px', jpy: '16px' },
  };
  const s = sizes[size] || sizes.md;

  // VND
  const vndEl = document.createElement('span');
  vndEl.textContent = `${(vnd || 0).toLocaleString()} VND`;
  vndEl.style.cssText = `
    font-weight: 700;
    font-size: ${s.vnd};
    color: var(--color-text);
  `;

  // JPY
  const jpyEl = document.createElement('span');
  jpyEl.textContent = `(¥${(jpy || 0).toLocaleString()})`;
  jpyEl.style.cssText = `
    font-weight: 500;
    font-size: ${s.jpy};
    color: var(--color-accent);
  `;

  wrapper.appendChild(vndEl);
  wrapper.appendChild(jpyEl);

  // Suffix
  if (suffix) {
    const suffixEl = document.createElement('span');
    suffixEl.textContent = suffix;
    suffixEl.style.cssText = `
      font-size: ${s.jpy};
      color: var(--color-text-secondary);
      font-weight: 400;
    `;
    wrapper.appendChild(suffixEl);
  }

  container.appendChild(wrapper);
  return wrapper;
}
