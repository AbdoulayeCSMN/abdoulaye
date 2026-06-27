import AdminAuthGuard from '../_components/AdminAuthGuard';
import AdminNav from '../_components/AdminNav';
import AdminCourses from '../_components/cours';

export default function AdminCoursesPage() {
  return (
    <AdminAuthGuard>
      <AdminNav />
      <AdminCourses />
    </AdminAuthGuard>
  );
}
