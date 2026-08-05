import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { router } from '@/router';

export default function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Header />
        <main className="flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-gray-500">Loading...</div>
            </div>
          }>
            <RouterProvider router={router} />
          </Suspense>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
