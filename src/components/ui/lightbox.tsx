"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";

interface LightboxImage {
  src: string;
  alt: string;
  title?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onImageSelect?: (index: number) => void;
}

export function Lightbox({ 
  images, 
  isOpen, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrevious,
  onImageSelect
}: LightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case ' ':
          event.preventDefault();
          setIsZoomed(!isZoomed);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isZoomed, onClose, onNext, onPrevious]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsZoomed(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xl"
        onClick={onClose}
      >
        {/* Close button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all duration-200 cursor-pointer"
        >
          <X className="h-6 w-6" />
        </motion.button>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all duration-200 cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </>
        )}

        {/* Zoom button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(!isZoomed);
          }}
          className="absolute top-4 left-4 z-10 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all duration-200 cursor-pointer"
        >
          {isZoomed ? <ZoomOut className="h-6 w-6" /> : <ZoomIn className="h-6 w-6" />}
        </motion.button>

        {/* Image counter */}
        {images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {currentIndex + 1} / {images.length}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Image container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center justify-center h-full p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex} // This ensures animation triggers on index change
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: isZoomed ? 1.5 : 1,
              }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                opacity: { duration: 0.2 },
                x: { duration: 0.3 },
                scale: { duration: 0.2 }
              }}
              className={`relative max-w-full max-h-full ${isZoomed ? 'cursor-grab' : 'cursor-zoom-in'}`}
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: isZoomed ? '200%' : '90vw',
                maxHeight: isZoomed ? '200%' : '90vh'
              }}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  width={1200}
                  height={800}
                  className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg"
                  priority
                />
              </motion.div>
              
              {/* Image title */}
              {currentImage.title && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/40 to-transparent backdrop-blur-md border-t border-white/10 p-4 rounded-b-lg"
                >
                  <h3 className="text-white text-lg font-medium">{currentImage.title}</h3>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="flex gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 max-w-(--breakpoint-sm) overflow-x-auto">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onImageSelect) {
                      onImageSelect(index);
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-16 h-12 rounded overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                    index === currentIndex 
                      ? 'border-blue-400 shadow-lg shadow-blue-400/50' 
                      : 'border-transparent hover:border-white/50'
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                  <AnimatePresence>
                    {index === currentIndex && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-blue-400/20 backdrop-blur-[1px]"
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 text-center text-white/70 text-sm"
        >
          <p>Press ESC to close • Use arrow keys to navigate • Spacebar to zoom</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}