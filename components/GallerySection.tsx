'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Category = 'all' | 'exterior' | 'interior' | 'rooms' | 'beach';

// Hotlinked directly from the Airbnb listing's own photo CDN instead of storing
// copies in the repo - keeps the same photos guests already see on Airbnb and
// keeps the git repo / deploy size light.
const AIRBNB_HOST = 'https://a0.muscache.com/im/pictures/hosting/Hosting-1583142544563137626/original';
const airbnbImg = (id: string) => `${AIRBNB_HOST}/${id}.jpeg?im_w=1200&width=1200&quality=75&auto=webp`;

const galleryImages = [
  // Exterior
  { src: airbnbImg('c0678a33-9437-41df-9f96-e95d476a8717'), category: 'exterior', alt: 'Villa Sera from the sea' },
  { src: airbnbImg('af421233-b67e-4a1b-939c-42bb164b7a34'), category: 'exterior', alt: 'Villa at twilight' },
  { src: airbnbImg('f9415e2b-b50f-4071-8d4a-1a370d40873a'), category: 'exterior', alt: 'Villa facade' },
  { src: airbnbImg('1186749e-7a43-4033-9f7a-e6597c57d0df'), category: 'exterior', alt: 'Exterior terrace' },
  { src: airbnbImg('a0d715da-6b4b-4342-8163-6bdf3da61cff'), category: 'exterior', alt: 'Exterior terrace' },
  { src: airbnbImg('cc54ff3e-fb99-47bd-bd75-8da2867e141c'), category: 'exterior', alt: 'Exterior view' },
  { src: airbnbImg('eb5bae1a-5fc5-421a-a881-973d4559de7f'), category: 'exterior', alt: 'Infinity pool' },
  // Beach
  { src: airbnbImg('1c342fc1-989f-4b7d-9bb2-0db53b63bbeb'), category: 'beach', alt: 'Path down to the private beach' },
  { src: airbnbImg('c57e248d-56e4-441b-98df-8a844a939ba4'), category: 'beach', alt: 'Private cove beach' },
  // Interior
  { src: airbnbImg('31d2e042-c704-462e-ba37-44f49f92e819'), category: 'interior', alt: 'Living room' },
  { src: airbnbImg('759db471-3461-4960-820b-c0ceeaca3e9f'), category: 'interior', alt: 'Gourmet kitchen' },
  { src: airbnbImg('906719f3-4034-44a7-ad1c-72d1a8710167'), category: 'interior', alt: 'Kitchen' },
  { src: airbnbImg('dbceb58b-1065-447c-8a00-d1ff0d57eca4'), category: 'interior', alt: 'Poolside kitchenette and bar' },
  { src: airbnbImg('5f36da75-fc2c-4c27-88e6-bb56ece6e320'), category: 'interior', alt: 'Dining room' },
  { src: airbnbImg('3cbcdf61-9927-476a-9977-ea0f53999f54'), category: 'interior', alt: 'Terrace dining' },
  { src: airbnbImg('fac0e2f2-f9d3-41a9-bb90-edc811546fec'), category: 'interior', alt: 'Bathroom' },
  { src: airbnbImg('92f16c3f-1821-4922-9d67-cc65f4e3a6ea'), category: 'interior', alt: 'Bathroom' },
  // Rooms
  { src: airbnbImg('3d3de8d6-7a5d-40d6-a807-d74a7191dbf5'), category: 'rooms', alt: 'Bedroom 1' },
  { src: airbnbImg('bfeccbcb-b388-494f-ab1a-6f0d67bf24c1'), category: 'rooms', alt: 'Master suite ocean-view terrace' },
  { src: airbnbImg('86343df8-a0a3-47af-b547-c85038289c8a'), category: 'rooms', alt: 'Bedroom 2' },
  { src: airbnbImg('d0cc8d86-b361-4314-9391-59d546c3a8a8'), category: 'rooms', alt: 'Bedroom 3' },
  { src: airbnbImg('fdba7ace-0903-4e2c-9fe3-d4410956c29e'), category: 'rooms', alt: 'Bedroom 4' },
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
