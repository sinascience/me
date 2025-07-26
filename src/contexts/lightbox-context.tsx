"use client";
import React, { createContext, useContext, useState } from 'react';
import { Lightbox } from "@/components/ui/lightbox";

interface LightboxImage {
  src: string;
  alt: string;
  title?: string;
}

interface LightboxContextType {
  openLightbox: (images: LightboxImage[], initialIndex?: number) => void;
  closeLightbox: () => void;
  isOpen: boolean;
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<LightboxImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (lightboxImages: LightboxImage[], initialIndex: number = 0) => {
    setImages(lightboxImages);
    setCurrentIndex(initialIndex);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setCurrentIndex(0);
    setImages([]);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <LightboxContext.Provider value={{ openLightbox, closeLightbox, isOpen }}>
      {children}
      {/* Global Lightbox Component */}
      <Lightbox
        images={images}
        isOpen={isOpen}
        currentIndex={currentIndex}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrevious={previousImage}
        onImageSelect={selectImage}
      />
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (context === undefined) {
    throw new Error('useLightbox must be used within a LightboxProvider');
  }
  return context;
}