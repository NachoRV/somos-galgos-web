'use client';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface SuccessStory {
  dogName: string;
  dogImage: {
    url?: string;
    alt?: string;
  } | string;
  ownerName: string;
  testimonial: string;
  adoptionDate: string;
  featured?: boolean;
  active?: boolean;
  order?: number;
}

interface SuccessStoriesSectionProps {
  stories?: SuccessStory[];
  enabled?: boolean;
}

const DEFAULT_STORIES: SuccessStory[] = [
  {
    dogName: 'Luna',
    ownerName: 'María García',
    testimonial: 'Luna ha transformado completamente nuestras vidas. Es la compañera perfecta y no podemos imaginar nuestro hogar sin ella.',
    adoptionDate: '2024-03-15',
    dogImage: '/logo.webp',
    active: true,
    order: 0,
  },
  {
    dogName: 'Max',
    ownerName: 'Carlos Rodríguez',
    testimonial: 'Adoptar a Max fue la mejor decisión que hemos tomado. Es increíblemente cariñoso y se ha adaptado perfectamente a nuestra familia.',
    adoptionDate: '2024-05-22',
    dogImage: '/logo.webp',
    active: true,
    order: 1,
  },
  {
    dogName: 'Bella',
    ownerName: 'Ana Martínez',
    testimonial: 'Bella llegó asustada, pero con paciencia y amor se ha convertido en la perra más feliz del mundo. ¡Gracias por darnos esta oportunidad!',
    adoptionDate: '2024-08-10',
    dogImage: '/logo.webp',
    active: true,
    order: 2,
  },
];

export function SuccessStoriesSection({ stories: propStories, enabled = true }: SuccessStoriesSectionProps) {
  const t = useTranslations('Home.SuccessStories');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const stories = useMemo(() => {
    if (!propStories || propStories.length === 0) {
      return DEFAULT_STORIES;
    }
    
    return [...propStories]
      .filter(story => story.active !== false)
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (a.order || 0) - (b.order || 0);
      });
  }, [propStories]);
  
  if (!enabled || stories.length === 0) {
    return null;
  }
  
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  };
  
  const currentStory = stories[currentIndex];
  
  return (
    <section className="py-20 px-16 bg-base-100">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[var(--color-primary)]">
            {t('title')}
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center p-12 relative">
              <Quote className="absolute top-8 left-8 w-12 h-12 text-[var(--color-secondary)] opacity-20" />
              
              <div className="avatar mb-6">
                <div className="w-32 rounded-full ring ring-[var(--color-secondary)] ring-offset-base-100 ring-offset-2">
                  <Image
                    src={typeof currentStory.dogImage === 'object' && currentStory.dogImage.url ? currentStory.dogImage.url : (typeof currentStory.dogImage === 'string' ? currentStory.dogImage : '/logo.webp')}
                    alt={currentStory.dogName}
                    width={128}
                    height={128}
                    className="object-cover"
                    priority={currentIndex === 0}
                    unoptimized={typeof currentStory.dogImage === 'object' && currentStory.dogImage.url && (currentStory.dogImage.url.includes('r2.cloudflarestorage.com') || currentStory.dogImage.url.includes('r2.dev'))}
                  />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold mb-2">{currentStory.dogName}</h3>
              <p className="text-sm text-base-content/60 mb-6">
                {t('adoptedBy', { owner: currentStory.ownerName })}
              </p>
              
              <blockquote className="text-xl italic mb-6 max-w-2xl">
                &ldquo;{currentStory.testimonial}&rdquo;
              </blockquote>
              
              <p className="text-sm text-base-content/50">
                {new Date(currentStory.adoptionDate).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button 
              onClick={handlePrev}
              className="btn btn-circle btn-outline"
              aria-label="Previous story"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex gap-2">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-[var(--color-secondary)] w-8' 
                      : 'bg-base-300'
                  }`}
                  aria-label={`Go to story ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              className="btn btn-circle btn-outline"
              aria-label="Next story"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
