import { ReactNode } from 'react';

export const metadata = {
  title: 'Admin — Portfolio Abdoulaye',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20">
      {children}
    </div>
  );
}
