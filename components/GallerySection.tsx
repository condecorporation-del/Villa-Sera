'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import SectionHeader from './SectionHeader';

const VIDEO_SRC =
  'https://res.cloudinary.com/dt9iyiorn/video/upload/v1782976236/Some_places_dont_just_take_your_breath_away_they_give_it_back_to_you._Villa_Sera_is_a_priva_xy0u9m.mp4';

type Category = 'all' | 'sala' | 'cocina' | 'comedor' | 'cuartos' | 'banos' | 'exterior' | 'alberca';

// Hotlinked directly from the Airbnb listing's own photo CDN instead of storing
// copies in the repo - the same photos guests already see on Airbnb, grouped
// into the exact same categories Airbnb itself uses for this listing, one
// photo per shot (no repeats).
const AIRBNB_HOST = 'https://a0.muscache.com/im/pictures/hosting/Hosting-1583142544563137626/original';
const airbnbImg = (id: string) => `${AIRBNB_HOST}/${id}.jpeg?im_w=1200&width=1200&quality=75&auto=webp`;

const galleryImages = [
  // Sala
  { src: airbnbImg('31d2e042-c704-462e-ba37-44f49f92e819'), category: 'sala', alt: 'Living room', featured: true },
  // Cocina
  { src: airbnbImg('759db471-3461-4960-820b-c0ceeaca3e9f'), category: 'cocina', alt: 'Gourmet kitchen', featured: true },
  { src: airbnbImg('906719f3-4034-44a7-ad1c-72d1a8710167'), category: 'cocina', alt: 'Kitchen', featured: false },
  { src: airbnbImg('dcf3f7fb-d4c7-44ed-be38-92f7599d862f'), category: 'cocina', alt: 'Kitchen', featured: false },
  { src: airbnbImg('dbceb58b-1065-447c-8a00-d1ff0d57eca4'), category: 'cocina', alt: 'Poolside kitchenette and bar', featured: false },
  // Comedor
  { src: airbnbImg('5f36da75-fc2c-4c27-88e6-bb56ece6e320'), category: 'comedor', alt: 'Dining room', featured: true },
  { src: airbnbImg('3cbcdf61-9927-476a-9977-ea0f53999f54'), category: 'comedor', alt: 'Terrace dining', featured: false },
  // Cuartos (bedrooms)
  { src: airbnbImg('3d3de8d6-7a5d-40d6-a807-d74a7191dbf5'), category: 'cuartos', alt: 'Bedroom 1', featured: false },
  { src: airbnbImg('bfeccbcb-b388-494f-ab1a-6f0d67bf24c1'), category: 'cuartos', alt: 'Master suite ocean-view terrace', featured: true },
  { src: airbnbImg('86343df8-a0a3-47af-b547-c85038289c8a'), category: 'cuartos', alt: 'Bedroom 2', featured: false },
  { src: airbnbImg('d0cc8d86-b361-4314-9391-59d546c3a8a8'), category: 'cuartos', alt: 'Bedroom 3', featured: false },
  { src: airbnbImg('fdba7ace-0903-4e2c-9fe3-d4410956c29e'), category: 'cuartos', alt: 'Bedroom 4', featured: false },
  // Baños (bathrooms)
  { src: airbnbImg('fac0e2f2-f9d3-41a9-bb90-edc811546fec'), category: 'banos', alt: 'Bathroom 1', featured: false },
  { src: airbnbImg('92f16c3f-1821-4922-9d67-cc65f4e3a6ea'), category: 'banos', alt: 'Bathroom 2', featured: false },
  { src: airbnbImg('9fc7fa86-d617-4003-825a-33e927a2cc63'), category: 'banos', alt: 'Bathroom 3', featured: false },
  { src: airbnbImg('bb97cc97-7727-4428-a64e-4bb9cbf208b8'), category: 'banos', alt: 'Bathroom 4', featured: false },
  // Exterior
  { src: airbnbImg('c0678a33-9437-41df-9f96-e95d476a8717'), category: 'exterior', alt: 'Villa Sera from the sea', featured: true },
  { src: airbnbImg('af421233-b67e-4a1b-939c-42bb164b7a34'), category: 'exterior', alt: 'Villa at twilight', featured: true },
  { src: airbnbImg('f9415e2b-b50f-4071-8d4a-1a370d40873a'), category: 'exterior', alt: 'Villa facade', featured: false },
  { src: airbnbImg('1186749e-7a43-4033-9f7a-e6597c57d0df'), category: 'exterior', alt: 'Exterior terrace', featured: false },
  { src: airbnbImg('a0d715da-6b4b-4342-8163-6bdf3da61cff'), category: 'exterior', alt: 'Exterior terrace', featured: false },
  { src: airbnbImg('cc54ff3e-fb99-47bd-bd75-8da2867e141c'), category: 'exterior', alt: 'Exterior view', featured: false },
  { src: airbnbImg('1c342fc1-989f-4b7d-9bb2-0db53b63bbeb'), category: 'exterior', alt: 'Path down to the private beach', featured: true },
  { src: airbnbImg('c57e248d-56e4-441b-98df-8a844a939ba4'), category: 'exterior', alt: 'Private cove beach', featured: true },
  // Alberca (pool)
  { src: airbnbImg('eb5bae1a-5fc5-421a-a881-973d4559de7f'), category: 'alberca', alt: 'Infinity pool', featured: true },
  { src: airbnbImg('9070c132-eb9a-4609-853a-2da28c26a555'), category: 'alberca', alt: 'Pool', featured: false },
  { src: airbnbImg('7dffdbbb-c360-4ad1-8ef3-143c9d36c481'), category: 'alberca', alt: 'Pool', featured: false },
];

export default function GallerySection() {
  const t = useTranslations('gallery');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState<Category>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [videoOn, setVideoOn] = useState(false);

  const filtered = active === 'all'
    ? galleryImages.filter((img) => img.featured)
    : galleryImages.filter((img) => img.category === active);

  const prev = () => setLightbox((i) => (i === null || i === 0 ? filtered.length - 1 : i - 1));
  const next = () => setLightbox((i) => (i === null ? 0 : (i + 1) % filtered.length));

  const categories: Category[] = ['all', 'sala', 'cocina', 'comedor', 'cuartos', 'banos', 'exterior', 'alberca'];

  return (
    <section id="galeria" ref={ref} className="py-24 lg:py-36 bg-[#0A2430]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeader
          label={t('label')}
          title={t('title')}
          subtitle={t('subtitle')}
          inView={inView}
          align="center"
        />

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2.5 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-[10px] tracking-[0.18em] uppercase font-sans px-4 py-2.5 border transition-colors duration-200 ${
                active === cat
                  ? 'bg-[#C9A84C] text-[#04141C] border-[#C9A84C]'
                  : 'text-[#EFE7DA]/55 border-[#EFE7DA]/15 hover:border-[#EFE7DA]/50 hover:text-[#EFE7DA]'
              }`}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </motion.div>

        {/* Grid (or the villa video, when "All" is selected) */}
        {active === 'all' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden mx-auto max-w-5xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-[#EFE7DA]/12 bg-black"
            style={{ aspectRatio: '16/9' }}
          >
            {/* The film is ~9MB. It stays unrequested until someone asks for
                it: until then this is just the optimised poster. */}
            {videoOn ? (
              <video
                autoPlay
                controls
                playsInline
                preload="auto"
                poster="/images/CasaSergio233.jpg"
                // autoPlay alone can be refused by the browser's autoplay
                // policy; asking again once it can play covers that. If the
                // browser still says no, the controls are right there.
                onCanPlay={(e) => {
                  void e.currentTarget.play().catch(() => {});
                }}
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={VIDEO_SRC} type="video/mp4" />
              </video>
            ) : (
              <button
                onClick={() => setVideoOn(true)}
                className="group absolute inset-0 w-full h-full"
                aria-label={t('play_video')}
              >
                <Image
                  src="/images/CasaSergio233.jpg"
                  alt=""
                  fill
                  quality={70}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
                <span className="absolute inset-0 bg-[#04141C]/25 group-hover:bg-[#04141C]/10 transition-colors duration-300" />
                <span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: '50%',
                    background: 'linear-gradient(140deg, #F0D28C 0%, #C9A84C 55%, #B08F3A 100%)',
                    boxShadow: '0 12px 40px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(240,210,140,0.5)',
                  }}
                >
                  <Play size={26} className="text-[#04141C] ml-1" fill="#04141C" />
                </span>
              </button>
            )}
          </motion.div>
        ) : (
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
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#04141C]/97 backdrop-blur-sm z-[100] flex items-center justify-center"
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
