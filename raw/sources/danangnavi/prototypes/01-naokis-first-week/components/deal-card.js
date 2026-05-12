// DealCard Component
// Business photo + deal description + savings in JPY + expiry countdown

export function renderDealCard(container, { photo, business, description, savingsJpy, expiresIn, onClick = null } = {}) {
  const card = document.createElement('div');
  card.className = 'deal-card';
  card.style.cssText = `
    background-color: var(--color-surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow-card);
    overflow: hidden;
    cursor: pointer;
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  `;

  // Photo
  const photoEl = document.createElement('div');
  photoEl.style.cssText = `
    width: 100%;
    aspect-ratio: 16 / 9;
    background-color: #E5E7EB;
    background-image: url('${photo || ''}');
    background-size: cover;
    background-position: center;
  `;
  if (!photo) {
    photoEl.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--color-text-secondary);font-size:14px;">Photo</div>`;
  }

  // Body
  const body = document.createElement('div');
  body.style.cssText = 'padding: 16px;';

  // Business name
  const businessEl = document.createElement('div');
  businessEl.textContent = business || 'Business';
  businessEl.style.cssText = `
    font-family: var(--font-headlines);
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 4px;
  `;

  // Deal description
  const descEl = document.createElement('div');
  descEl.textContent = description || '';
  descEl.style.cssText = `
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 12px;
  `;

  // Bottom row: savings + expiry
  const bottomRow = document.createElement('div');
  bottomRow.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

  // Savings badge
  const savingsBadge = document.createElement('span');
  savingsBadge.textContent = `Save ¥${(savingsJpy || 0).toLocaleString()}`;
  savingsBadge.style.cssText = `
    font-size: 12px;
    font-weight: 700;
    color: var(--color-secondary);
    background-color: rgba(255, 107, 74, 0.1);
    padding: 4px 10px;
    border-radius: var(--radius-full);
  `;

  // Expiry
  const expiryEl = document.createElement('span');
  expiryEl.textContent = expiresIn ? `Expires in ${expiresIn}` : '';
  const isUrgent = expiresIn && (expiresIn.includes('1 day') || expiresIn.includes('hour'));
  expiryEl.style.cssText = `
    font-size: 12px;
    color: ${isUrgent ? 'var(--color-error)' : 'var(--color-text-secondary)'};
    font-weight: ${isUrgent ? '600' : '400'};
  `;

  bottomRow.appendChild(savingsBadge);
  bottomRow.appendChild(expiryEl);

  body.appendChild(businessEl);
  body.appendChild(descEl);
  body.appendChild(bottomRow);

  card.appendChild(photoEl);
  card.appendChild(body);

  // Hover effects
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-2px)';
    card.style.boxShadow = 'var(--shadow-card-hover)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = 'var(--shadow-card)';
  });

  if (onClick) {
    card.addEventListener('click', onClick);
  }

  container.appendChild(card);
  console.log('[DealCard] Rendered:', business);
  return card;
}
