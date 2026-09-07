import Image from 'next/image';
import BackButton from '@/components/BackButton';

export default function CategoryHero({ category, categoryData, cms, t }: any) {
  return (
    <>
      {['changeovers', 'inverters', 'fuses-breakers', 'fans', 'solar-water-pump', 'solar-water-pumps', 'water-pumps'].includes(category) ? (
        <section className="w-full relative border-b border-gray-100 bg-white">
          <Image 
            src={t('Hero Banner Image') !== 'Hero Banner Image' ? t('Hero Banner Image') : `/images/${category}-bg.png`}
            alt={categoryData.title}
            width={1920} 
            height={600} 
            className="w-full h-auto object-cover" 
            priority
            unoptimized
          />
        </section>
      ) : (
        <section className="relative pt-24 pb-16 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <BackButton
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-red-600 uppercase tracking-widest mb-6 transition-colors mx-auto"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="3">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              {t('Back to B2B Catalog')}
            </BackButton>
            <span className="text-red-600 font-extrabold tracking-widest uppercase text-xs sm:text-sm block mb-4">
              {t('B2B WHOLESALE SOURCING PORTAL')}
            </span>
            <h1 className="font-black text-black tracking-tight uppercase leading-none mb-6 text-4xl sm:text-5xl md:text-7xl">
              {categoryData.title}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {categoryData.description}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
