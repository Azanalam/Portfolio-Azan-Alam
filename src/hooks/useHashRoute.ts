import { useState, useEffect } from 'react';

export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || '#/');
      // Scroll to top smoothly on route transitions
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newPath: string) => {
    window.location.hash = newPath;
  };

  // Parse path and slug:
  // e.g. '#/projects/aether-vm' -> path = '/projects/:slug', slug = 'aether-vm'
  const currentPath = hash.replace(/^#/, ''); // e.g. '/projects/aether-vm' or '/'
  let view = 'home';
  let slug = '';

  if (currentPath === '/' || currentPath === '') {
    view = 'home';
  } else if (currentPath === '/about') {
    view = 'about';
  } else if (currentPath === '/projects') {
    view = 'projects';
  } else if (currentPath.startsWith('/projects/')) {
    view = 'project-detail';
    slug = currentPath.substring('/projects/'.length);
  } else if (currentPath === '/services') {
    view = 'services';
  } else if (currentPath === '/skills') {
    view = 'skills';
  } else if (currentPath === '/contact') {
    view = 'contact';
  } else if (currentPath === '/admin') {
    view = 'admin-dashboard';
  } else if (currentPath === '/admin/login') {
    view = 'admin-login';
  } else {
    view = 'not-found';
  }

  return {
    hash,
    currentPath,
    view,
    slug,
    navigate,
  };
}
