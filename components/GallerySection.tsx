'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Category = 'all' | 'exterior' | 'interior' | 'rooms' | 'beach';

const galleryImages = [
  { src: '/images/CasaSergio233.jpg', category: 'exterior', alt: 'Sunset terrace view' },
  { src: '/images/CasaSergio238.jpg', category: 'exterior', alt: 'Outdoor dining at sunset' },
  { src: '/images/exterior 1.jpg', category: 'exterior', alt: 'Villa exterior at night' },
  { src: '/images/CasaSergio126.jpg', category: 'exterior', alt: 'Villa facade daytime' },
  { src: '/images/CasaSergio121.jpg', category: 'exterior', alt: 'View from the sea' },
  { src: '/images/CasaSergio139+.jpg', category: 'exterior', alt: 'Aerial view with Arch' },
  { src: '/images/CasaSergio180.jpg', category: 'beach', alt: 'Private beach path' },
  { src: '/images/CasaSergio181.jpg', category: 'beach', alt: 'Private cove with palms' },
  { src: '/images/CasaSergio182.jpg', category: 'beach', alt: 'Aerial cove view' },
  { src: '/images/livingroom villa serena.jpg', category: 'interior', alt: 'Living room' },
  { src: '/images/diningroom1.jpg', category: 'interior', alt: 'Indoor dining room' },
  { src: '/images/diningroom2.jpg', category: 'interior', alt: 'Terrace dining at sunset' },
  { src: '/images/master room 1.jpg', category: 'rooms', alt: 'Master suite ocean view' },
  { src: '/images/masteroom2.jpg', category: 'rooms', alt: 'Master suite' },
  { src: '/images/bedroom 2.jpg', category: 'rooms', alt: 'Bedroom with canopy' },
  { src: '/images/bathroom1.jpg', category: 'interior', alt: 'Master bathroom' },
];

export default function GallerySection() {
  const t = useTranslations('gallery');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState<Category>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active === 'all'
    ? galleryImages
    : galleryImages.filter((img) => img.category === active);

  const prev = () => setLightbox((i) => (i === null || i === 0 ? filtered.length - 1 : i - 1));
  const next = () => setLightbox((i) => (i === null ? 0 : (i + 1) % filtered.length));

  const categories: Category[] = ['all', 'exterior', 'interior', 'rooms', 'beach'];

  return (
    <section id="galeria" ref={ref} className="py-24 lg:py-32 bg-[#F8F4EF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[#C9A84C] text-xs tracking-[0.35em] uppercase font-sans mb-4"
          >
            {t('label')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#0D0D0D] text-4xl lg:text-5xl font-light tracking-wide mb-4"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#0D0D0D]/50 text-base font-sans font-light"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-xs tracking-[0.2em] uppercase font-sans px-5 py-2 border transition-all duration-200 ${
                active === cat
                  ? 'bg-[#0D0D0D] text-white border-[#0D0D0D]'
                  : 'text-[#0D0D0D]/60 border-[#0D0D0D]/20 hover:border-[#0D0D0D]/60'
              }`}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div
                key={img.src}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className={`relative cursor-pointer overflow-hidden group ${
                  i === 0 ? 'col-span-2 row-span-2' : ''
                }`}
                style={{ aspectRatio: i === 0 ? '1/1' : '4/3' }}
                onClick={() => setLightbox(i)}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  quality={75}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-5 right-5 text-white/70 hover:text-white z-10"
              onClick={() => setLightbox(null)}
            >
              <X size={28} />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 p-2"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft size={36} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 p-2"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight size={36} />
            </button>
            <div
              className="relative w-[90vw] h-[85vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightbox].src}
                alt={filtered[lightbox].alt}
                fill
                quality={85}
                className="object-contain"
                sizes="90vw"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
