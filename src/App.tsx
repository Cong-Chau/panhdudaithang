import { useLayoutEffect } from 'react';
import CelebrationPage from './pages/CelebrationPage';
import WomensDayPage from './pages/WomensDayPage';

export function routeFor(path: string): 'celebration' | 'womens-day' | 'missing' {
  const normalized = path.replace(/\/+$/, '') || '/';
  return normalized === '/' ? 'celebration' : normalized === '/20-10' ? 'womens-day' : 'missing';
}
export default function App() {
  const route = routeFor(window.location.pathname);
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.landing = route;
    root.classList.toggle('celebration-page', route === 'celebration');
    return () => {
      root.classList.remove('celebration-page');
      delete root.dataset.landing;
    };
  }, [route]);
  if (route === 'celebration') return <CelebrationPage/>;
  if (route === 'womens-day') return <WomensDayPage/>;
  return <main style={{ maxWidth: '40rem', margin: '3rem auto', padding: '1rem', fontFamily: 'Arial, sans-serif' }}><h1>Không tìm thấy trang</h1><a href="/">Về trang chúc mừng</a></main>;
}
