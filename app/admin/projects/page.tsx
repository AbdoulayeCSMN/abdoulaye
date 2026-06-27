import AdminAuthGuard from '../_components/AdminAuthGuard';
import AdminNav from '../_components/AdminNav';
import AdminProjects from '../_components/projects';

export default function AdminProjectsPage() {
  return (
    <AdminAuthGuard>
      <AdminNav />
      <AdminProjects />
    </AdminAuthGuard>
  );
}
