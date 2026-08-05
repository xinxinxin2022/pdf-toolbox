import { createHashRouter } from 'react-router-dom';
import Home from '@/views/Home';
import ToolPage from '@/views/ToolPage';
import PrivacyPolicy from '@/views/PrivacyPolicy';
import TermsOfService from '@/views/TermsOfService';
import About from '@/views/About';
import Contact from '@/views/Contact';

export const router = createHashRouter([
  { path: '/', element: <Home /> },
  { path: '/tool/:slug', element: <ToolPage /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/terms-of-service', element: <TermsOfService /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '*', element: <Home /> },
]);
