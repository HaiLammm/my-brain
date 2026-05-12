// TopNavBar Component
// Sticky desktop navigation bar with logo, nav links, and profile CTA

const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'search', label: 'Search', href: '/search' },
  { id: 'community', label: 'Community', href: '/community' },
  { id: 'deals', label: 'Deals', href: '/deals' },
];

export function renderTopNav(container, { activePage = 'home' } = {}) {
  const nav = document.createElement('nav');
  nav.id = 'top-nav';
  nav.style.cssText = `
    position: sticky;
    top: 0;
    width: 100%;
    height: 64px;
    background-color: var(--color-primary);
    box-shadow: var(--shadow-nav);
    z-index: 50;
  `;

  const inner = document.createElement('div');
  inner.style.cssText = `
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

  // Logo
  const logo = document.createElement('a');
  logo.href = '/';
  logo.textContent = 'DaNangNavi';
  logo.style.cssText = `
    font-family: var(--font-headlines);
    font-size: 20px;
    font-weight: 700;
    color: #FFFFFF;
    text-decoration: none;
    letter-spacing: -0.5px;
  `;

  // Nav Links
  const navLinks = document.createElement('div');
  navLinks.style.cssText = `
    display: flex;
    align-items: center;
    gap: 32px;
  `;

  NAV_LINKS.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    a.dataset.navLink = link.id;
    const isActive = link.id === activePage;
    a.style.cssText = `
      font-family: var(--font-ui);
      font-size: 14px;
      font-weight: ${isActive ? '600' : '400'};
      color: ${isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)'};
      text-decoration: none;
      padding-bottom: 4px;
      border-bottom: 2px solid ${isActive ? '#FFFFFF' : 'transparent'};
      transition: color var(--transition-fast), border-color var(--transition-fast);
    `;
    a.addEventListener('mouseenter', () => {
      if (!isActive) {
        a.style.color = '#FFFFFF';
        a.style.borderBottomColor = 'rgba(255,255,255,0.4)';
      }
    });
    a.addEventListener('mouseleave', () => {
      if (!isActive) {
        a.style.color = 'rgba(255,255,255,0.7)';
        a.style.borderBottomColor = 'transparent';
      }
    });
    navLinks.appendChild(a);
  });

  // Right side: Sign Up button
  const rightSide = document.createElement('div');
  rightSide.style.cssText = `
    display: flex;
    align-items: center;
    gap: 16px;
  `;

  const signUpBtn = document.createElement('button');
  signUpBtn.textContent = 'Sign Up';
  signUpBtn.id = 'nav-signup-btn';
  signUpBtn.style.cssText = `
    font-family: var(--font-ui);
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
    background-color: var(--color-secondary);
    border: none;
    padding: 8px 20px;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: opacity var(--transition-fast);
  `;
  signUpBtn.addEventListener('mouseenter', () => { signUpBtn.style.opacity = '0.9'; });
  signUpBtn.addEventListener('mouseleave', () => { signUpBtn.style.opacity = '1'; });

  rightSide.appendChild(signUpBtn);

  inner.appendChild(logo);
  inner.appendChild(navLinks);
  inner.appendChild(rightSide);
  nav.appendChild(inner);
  container.appendChild(nav);

  console.log('[TopNav] Rendered with activePage:', activePage);
  return nav;
}
