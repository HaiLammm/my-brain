// SenpaiCard Component
// Photo + title + rating + senpai avatar + verified badge

export function renderSenpaiCard(container, { photo, title, rating, senpai, verified = false, onClick = null } = {}) {
  const card = document.createElement('div');
  card.className = 'senpai-card';
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
    aspect-ratio: 4 / 3;
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

  // Title
  const titleEl = document.createElement('h3');
  titleEl.textContent = title || 'Untitled';
  titleEl.style.cssText = `
    font-family: var(--font-headlines);
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 8px;
  `;

  // Rating
  const ratingEl = document.createElement('div');
  ratingEl.style.cssText = `
    font-size: 14px;
    color: var(--color-warning);
    margin-bottom: 12px;
  `;
  ratingEl.textContent = `⭐ ${rating || '0.0'}`;

  // Senpai row
  const senpaiRow = document.createElement('div');
  senpaiRow.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  // Avatar
  const avatar = document.createElement('div');
  avatar.style.cssText = `
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #D1D5DB;
    background-image: url('${senpai?.avatar || ''}');
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
  `;

  // Name
  const nameEl = document.createElement('span');
  nameEl.textContent = senpai?.name || 'Senpai';
  nameEl.style.cssText = `
    font-size: 14px;
    color: var(--color-text-secondary);
    flex-shrink: 0;
  `;

  senpaiRow.appendChild(avatar);
  senpaiRow.appendChild(nameEl);

  // Verified badge
  if (verified) {
    const badge = document.createElement('span');
    badge.textContent = 'Senpai Verified ✓';
    badge.className = 'senpai-verified-badge';
    badge.style.cssText = `
      font-size: 11px;
      font-weight: 500;
      color: var(--color-success);
      background-color: rgba(39, 174, 96, 0.1);
      padding: 2px 8px;
      border-radius: var(--radius-full);
      white-space: nowrap;
    `;
    senpaiRow.appendChild(badge);
  }

  body.appendChild(titleEl);
  body.appendChild(ratingEl);
  body.appendChild(senpaiRow);

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
  console.log('[SenpaiCard] Rendered:', title);
  return card;
}
