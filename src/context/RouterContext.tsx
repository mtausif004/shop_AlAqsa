import React, { createContext, useContext, useState, useEffect } from 'react';

export type RouteType =
  | 'home'
  | 'product'
  | 'category'
  | 'search'
  | 'offers'
  | 'combo'
  | 'cart'
  | 'checkout'
  | 'track-order'
  | 'invoice'
  | 'about'
  | 'contact'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'admin'
  | 'not-found';

interface RouteState {
  path: string;
  route: RouteType;
  params: Record<string, string>;
}

interface RouterContextType extends RouteState {
  navigate: (to: string, replace?: boolean) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

function parsePath(pathname: string): { route: RouteType; params: Record<string, string> } {
  // Normalize path
  let path = pathname.replace(/\/+$/, '');
  if (!path) path = '/';

  // Check /SecurePanel-Aqsa
  if (path === '/SecurePanel-Aqsa' || path.startsWith('/SecurePanel-Aqsa/')) {
    return { route: 'admin', params: {} };
  }

  if (path === '/' || path === '/home') {
    return { route: 'home', params: {} };
  }

  // /product/:id
  const productMatch = path.match(/^\/product\/([^\/]+)$/i);
  if (productMatch) {
    return { route: 'product', params: { productId: productMatch[1] } };
  }

  // /category/:slug/:subslug?
  const categorySubMatch = path.match(/^\/category\/([^\/]+)\/([^\/]+)$/i);
  if (categorySubMatch) {
    return {
      route: 'category',
      params: { categorySlug: categorySubMatch[1], subcategorySlug: decodeURIComponent(categorySubMatch[2]) }
    };
  }

  const categoryMatch = path.match(/^\/category\/([^\/]+)$/i);
  if (categoryMatch) {
    return { route: 'category', params: { categorySlug: categoryMatch[1] } };
  }

  // /invoice/:id
  const invoiceMatch = path.match(/^\/invoice\/([^\/]+)$/i);
  if (invoiceMatch) {
    return { route: 'invoice', params: { invoiceId: invoiceMatch[1] } };
  }

  if (path === '/search') return { route: 'search', params: {} };
  if (path === '/offers') return { route: 'offers', params: {} };
  if (path === '/combo') return { route: 'combo', params: {} };
  if (path === '/cart') return { route: 'cart', params: {} };
  if (path === '/checkout') return { route: 'checkout', params: {} };
  if (path === '/track-order') return { route: 'track-order', params: {} };
  if (path === '/about') return { route: 'about', params: {} };
  if (path === '/contact') return { route: 'contact', params: {} };
  if (path === '/faq') return { route: 'faq', params: {} };
  if (path === '/privacy') return { route: 'privacy', params: {} };
  if (path === '/terms') return { route: 'terms', params: {} };

  return { route: 'not-found', params: {} };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });

  const parsed = parsePath(currentPath);

  const navigate = (to: string, replace: boolean = false) => {
    if (typeof window === 'undefined') return;
    if (replace) {
      window.history.replaceState(null, '', to);
    } else {
      window.history.pushState(null, '', to);
    }
    setCurrentPath(to.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <RouterContext.Provider
      value={{
        path: currentPath,
        route: parsed.route,
        params: parsed.params,
        navigate
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within a RouterProvider');
  return ctx;
}
