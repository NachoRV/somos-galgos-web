'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Heart, Home, DollarSign, Users } from 'lucide-react';

export function ImpactCounterSection() {
  const t = useTranslations('Home.Impact');
  const [counts, setCounts] = useState({ rescued: 0, adopted: 0, sponsored: 0, volunteers: 0 });
  
  const stats = [
    { key: 'rescued', icon: Heart, target: 250, color: 'text-red-500' },
    { key: 'adopted', icon: Home, target: 180, color: 'text-blue-500' },
    { key: 'sponsored', icon: DollarSign, target: 45, color: 'text-[var(--color-secondary)]' },
    { key: 'volunteers', icon: Users, target: 30, color: 'text-[var(--color-accent)]' },
  ];
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounts({
        rescued: Math.floor(stats[0].target * progress),
        adopted: Math.floor(stats[1].target * progress),
        sponsored: Math.floor(stats[2].target * progress),
        volunteers: Math.floor(stats[3].target * progress),
      });
      
      if (step >= steps) {
        clearInterval(timer);
        setCounts({
          rescued: stats[0].target,
          adopted: stats[1].target,
          sponsored: stats[2].target,
          volunteers: stats[3].target,
        });
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <section className="py-20 px-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={stat.key}
                className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <IconComponent className={`w-16 h-16 mx-auto mb-4 ${stat.color}`} />
                <div className="text-5xl font-bold mb-2">
                  {counts[stat.key as keyof typeof counts]}+
                </div>
                <p className="text-lg opacity-90">
                  {t(`${stat.key}Label`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
