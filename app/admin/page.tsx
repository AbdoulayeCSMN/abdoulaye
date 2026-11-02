import { redirect } from 'next/navigation';

// /admin n'avait pas de page (404). Les pages protégées vérifient la session
// côté client et renvoient vers /admin/login si besoin.
export default function AdminIndex() {
  redirect('/admin/profile');
}
