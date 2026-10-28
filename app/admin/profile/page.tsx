import AdminAuthGuard from '../_components/AdminAuthGuard';
import AdminNav from '../_components/AdminNav';
import AdminProfile from '../_components/profile';

export default function AdminProfilePage() {
  return (
    <AdminAuthGuard>
      <AdminNav />
      <AdminProfile />
    </AdminAuthGuard>
  );
}
