import { Header } from '@/components/layout/Header';
// import { Footer } from '@/components/layout/Footer';

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-primary text-secondary">
      <Header />
      dddd
      <main className="flex-1">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}