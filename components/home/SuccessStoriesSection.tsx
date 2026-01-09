'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export function SuccessStoriesSection() {
  const t = useTranslations('Home.SuccessStories');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const stories = [
    {
      dogName: 'Luna',
      ownerName: 'María García',
      quote: t('story1Quote'),
      date: '2024-03-15',
    },
    {
      dogName: 'Max',
      ownerName: 'Carlos Rodríguez',
      quote: t('story2Quote'),
      date: '2024-05-22',
    },
    {
      dogName: 'Bella',
      ownerName: 'Ana Martínez',
      quote: t('story3Quote'),
      date: '2024-08-10',
    },
  ];
  
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
                    src="/logo.webp"
                    alt={currentStory.dogName}
                    width={128}
                    height={128}
                  />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold mb-2">{currentStory.dogName}</h3>
              <p className="text-sm text-base-content/60 mb-6">
                {t('adoptedBy', { owner: currentStory.ownerName })}
              </p>
              
              <blockquote className="text-xl italic mb-6 max-w-2xl">
                "{currentStory.quote}"
              </blockquote>
              
              <p className="text-sm text-base-content/50">
                {new Date(currentStory.date).toLocaleDateString('es-ES', { 
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
