'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  const t = useTranslations('Home.Hero');
  
  return (
    <section className="relative min-h-[800px] flex items-center justify-center bg-gradient-to-br to-[var(--color-primary)] via-[var(--color-accent)] from-[var(--color-secondary)] text-white overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-16 py-20 text-center">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.webp"
            alt="Somos Galgos"
            width={120}
            height={120}
            priority
            className="drop-shadow-2xl"
          />
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg text-[var(--color-secondary)]">
          Somos Galgos
        </h1>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg">
          {t('title')}
        </h1>
        
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-95">
          {t('subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/adoptar" 
            className="btn btn-primary btn-lg text-lg px-8"
          >
            {t('ctaAdopt')}
          </Link>
          <Link 
            href="/colabora" 
            className="btn btn-outline btn-lg text-lg px-8 border-white text-white hover:bg-white hover:text-[var(--color-primary)]"
          >
            {t('ctaHelp')}
          </Link>
        </div>
      </div>
      
      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-base-100"/>
        </svg>
      </div>
    </section>
  );
}
