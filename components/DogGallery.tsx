'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { PhotoTransformed } from '@/types/dog';

interface DogGalleryProps {
  photos: PhotoTransformed[];
  dogName: string;
}

export function DogGallery({ photos, dogName }: DogGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!photos || photos.length === 0) {
    return (
      <div className="aspect-video bg-[var(--color-bg-secondary)] rounded-lg flex items-center justify-center text-6xl">
        🐕
      </div>
    );
  }

  const currentPhoto = photos[selectedIndex];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="space-y-4">
      {/* Galería principal */}
      <div className="relative aspect-video bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden group">
        <Image
          src={currentPhoto.url}
          alt={`${dogName} - ${currentPhoto.description || 'Foto'}`}
          fill
          className="object-cover cursor-pointer"
          onClick={() => setIsOpen(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
        />

        {/* Controles de navegación */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Siguiente foto"
            >
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {photos.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden ring-2 transition-all ${
                index === selectedIndex
                  ? 'ring-[var(--color-secondary)]'
                  : 'ring-transparent hover:ring-[var(--color-accent)]'
              }`}
            >
              <Image
                src={photo.url}
                alt={`Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal a pantalla completa */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            aria-label="Cerrar"
          >
            <X size={32} />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 text-white hover:text-gray-300"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={40} />
          </button>

          <Image
            src={currentPhoto.url}
            alt={`${dogName} - ${currentPhoto.description || 'Foto'}`}
            width={1200}
            height={800}
            className="max-h-[90vh] w-auto object-contain"
          />

          <button
            onClick={handleNext}
            className="absolute right-4 text-white hover:text-gray-300"
            aria-label="Siguiente foto"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </div>
  );
}
