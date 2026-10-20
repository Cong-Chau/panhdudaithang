import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { routeFor } from './App';
import './style.css';
import './viewport.css';

const route = routeFor(window.location.pathname);
document.documentElement.dataset.landing = route;
document.documentElement.classList.toggle('celebration-page', route === 'celebration');
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
