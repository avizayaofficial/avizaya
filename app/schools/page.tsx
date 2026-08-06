import { redirect } from 'next/navigation';

// ============================================================
// /schools — free model
// The homepage school grid is now the single source of truth.
// This route stays alive so old links and bookmarks don't 404.
// ============================================================

export default function SchoolsPage() {
  redirect('/#schools');
}
