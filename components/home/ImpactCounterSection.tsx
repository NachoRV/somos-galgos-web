'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useMemo } from 'react';
import { Heart, Home, DollarSign, Users, type LucideIcon } from 'lucide-react';

interface ImpactStat {
  key: string;
  icon_type: 'heart' | 'home' | 'dollar-sign' | 'users';
  target: number;
  color: string;
  order: number;
}

interface ImpactCounterSectionProps {
  stats?: ImpactStat[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  'heart': Heart,
  'home': Home,
  'dollar-sign': DollarSign,
  'users': Users,
};

const COLOR_MAP: Record<string, string> = {
  'red': 'text-red-500',
  'blue': 'text-blue-500',
  'green': 'text-green-500',
  'yellow': 'text-yellow-500',
  'purple': 'text-purple-500',
  'orange': 'text-orange-500',
  'primary': 'text-[var(--color-primary)]',
  'secondary': 'text-[var(--color-secondary)]',
  'accent': 'text-[var(--color-accent)]',
};

const DEFAULT_STATS: ImpactStat[] = [
  { key: 'rescued', icon_type: 'heart', target: 9999, color: 'red', order: 1 },
  { key: 'adopted', icon_type: 'home', target: 9999, color: 'blue', order: 2 },
  { key: 'sponsored', icon_type: 'dollar-sign', target: 9999, color: 'secondary', order: 3 },
  { key: 'volunteers', icon_type: 'users', target: 9999, color: 'accent', order: 4 },
];

export function ImpactCounterSection({ stats: propStats }: ImpactCounterSectionProps) {
  const t = useTranslations('Home.Impact');

  const stats = useMemo<ImpactStat[]>(() => {
    if (!propStats || propStats.length === 0) {
      return DEFAULT_STATS;
    }

    return [...propStats]
      .map((stat, index) => ({
        ...stat,
        target: Number(stat.target) || 0,
        order: Number.isFinite(stat.order) ? stat.order : index,
      }))
      .sort((a, b) => a.order - b.order);
  }, [propStats]);

  const initialCounts = useMemo(
    () => stats.reduce((acc, stat) => ({ ...acc, [stat.key]: 0 }), {} as Record<string, number>),
    [stats]
  );

  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  
  useEffect(() => {
    setCounts(initialCounts);
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      const newCounts = stats.reduce((acc, stat) => ({
        ...acc,
        [stat.key]: Math.floor(stat.target * progress),
      }), {} as Record<string, number>);
      
      setCounts(newCounts);
      
      if (step >= steps) {
        clearInterval(timer);
        const finalCounts = stats.reduce((acc, stat) => ({
          ...acc,
          [stat.key]: stat.target,
        }), {} as Record<string, number>);
        setCounts(finalCounts);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [stats, initialCounts]);
  
  return (
    <section className="py-20 px-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white flex justify-center">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {stats.map((stat) => {
            const IconComponent = ICON_MAP[stat.icon_type] || Heart;
            const colorClass = COLOR_MAP[stat.color] || 'text-gray-500';
            return (
              <div 
                key={stat.key}
                className="basis-full sm:basis-[calc(50%-1rem)] lg:basis-[calc(25%-1.5rem)] max-w-sm text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <IconComponent className={`w-16 h-16 mx-auto mb-4 ${colorClass}`} />
                <div className="text-5xl font-bold mb-2">
                  {counts[stat.key] || 0}+
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
