import AdminAuthGuard from '../_components/AdminAuthGuard';
import AdminNav from '../_components/AdminNav';
import AdminMessages from '../_components/messages';

export default function AdminMessagesPage() {
  return (
    <AdminAuthGuard>
      <AdminNav />
      <AdminMessages />
    </AdminAuthGuard>
  );
}
