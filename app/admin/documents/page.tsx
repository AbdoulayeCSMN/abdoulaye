import AdminAuthGuard from '../_components/AdminAuthGuard';
import AdminNav from '../_components/AdminNav';
import AdminDocuments from '../_components/documents';

export default function AdminDocumentsPage() {
  return (
    <AdminAuthGuard>
      <AdminNav />
      <AdminDocuments />
    </AdminAuthGuard>
  );
}
