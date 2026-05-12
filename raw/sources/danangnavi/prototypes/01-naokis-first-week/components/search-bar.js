// SearchBar Component
// Search input with icon, placeholder, and clear button

export function renderSearchBar(container, { size = 'large', placeholder = 'What are you looking for?', onSearch = null } = {}) {
  const wrapper = document.createElement('div');
  wrapper.id = 'search-bar';
  wrapper.style.cssText = `
    position: relative;
    width: 100%;
    max-width: ${size === 'large' ? '640px' : '320px'};
  `;

  // Search icon
  const searchIcon = document.createElement('div');
  searchIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;
  searchIcon.style.cssText = `
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-secondary);
    pointer-events: none;
    display: flex;
    align-items: center;
  `;

  // Input
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;
  input.id = 'search-input';
  const paddingY = size === 'large' ? '14px' : '10px';
  const fontSize = size === 'large' ? '16px' : '14px';
  input.style.cssText = `
    width: 100%;
    padding: ${paddingY} 44px ${paddingY} 48px;
    font-family: var(--font-body);
    font-size: ${fontSize};
    color: var(--color-text);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    outline: none;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  `;

  // Clear button
  const clearBtn = document.createElement('button');
  clearBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
  clearBtn.style.cssText = `
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    display: none;
    align-items: center;
    padding: 2px;
  `;

  // Focus state
  input.addEventListener('focus', () => {
    input.style.borderColor = 'var(--color-accent)';
    input.style.boxShadow = '0 0 0 3px rgba(46, 196, 182, 0.15)';
  });
  input.addEventListener('blur', () => {
    input.style.borderColor = 'var(--color-border)';
    input.style.boxShadow = 'none';
  });

  // Clear button visibility
  input.addEventListener('input', () => {
    clearBtn.style.display = input.value.length > 0 ? 'flex' : 'none';
    if (onSearch) onSearch(input.value);
  });
  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    input.focus();
    if (onSearch) onSearch('');
  });

  // Enter key
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(input.value);
    }
  });

  wrapper.appendChild(searchIcon);
  wrapper.appendChild(input);
  wrapper.appendChild(clearBtn);
  container.appendChild(wrapper);

  console.log('[SearchBar] Rendered, size:', size);
  return wrapper;
}
