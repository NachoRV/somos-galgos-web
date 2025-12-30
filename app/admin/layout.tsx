export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-black-olive text-satin-sheen-gold">
      <aside className="w-full bg-secondary-dark p-4 text-right">Panel de administración</aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}