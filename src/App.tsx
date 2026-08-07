import { Suspense } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/views/Home';
import ToolPage from '@/views/ToolPage';
import PrivacyPolicy from '@/views/PrivacyPolicy';
import TermsOfService from '@/views/TermsOfService';
import About from '@/views/About';
import Contact from '@/views/Contact';
import FAQPage from '@/views/FAQPage';
import Blog from '@/views/Blog';
import BlogPost from '@/views/BlogPost';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[var(--color-bg)]">
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-neutral-400">Loading...</div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/tool/:slug', element: <ToolPage /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/terms-of-service', element: <TermsOfService /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/faq', element: <FAQPage /> },
      { path: '/blog', element: <Blog /> },
      { path: '/blog/:slug', element: <BlogPost /> },
      { path: '*', element: <Home /> },
    ],
  },
]);

export default function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}
