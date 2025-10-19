'use client';

import Navbar from '@/components/Navbar';
import NotificationBar from '@/components/NotificationBarClient';
import RegistrationModal from '@/components/RegistrationModal';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <NotificationBar />
      <Navbar />
      <RegistrationModal />
      <main className="flex-1 w-full p-0 m-0 mt-16">{children}</main>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#363636',
            borderRadius: '10px',
            border: '1px solid #e0e0e0',
            paddingLeft: '16px',
            paddingRight: '16px',
          },
          success: {
            style: {
              border: '1px solid #4caf50',
            },
          },
          error: {
            style: {
              border: '1px solid #f44336',
            },
          },
        }}
      />
    </div>
  );
}
