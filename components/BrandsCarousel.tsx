'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

const BrandsCarousel = () => {
  const { state } = useApp();

  return (
    <div className="w-full py-12 bg-gradient-to-r from-blue-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Premium Brands</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {state.brands.map((brand) => {
            // Create URL-friendly brand ID
            const brandId = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace(/\./g, '');
            
            return (
              <Link 
                href={`/brands/${brandId}`} 
                key={brand.id} 
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden">
                  <Image
                    src={brand.image || '/brands/default.jpg'}
                    alt={brand.name}
                    fill
                    className="object-contain transform group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  />
                  {/* Dark overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h3 className="font-bold text-white text-xl mb-2 drop-shadow-lg">
                    {brand.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Array.isArray(brand.seasons) && brand.seasons.map((season: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white"
                      >
                        {season}
                      </span>
                    ))}
                  </div>
                  
                  <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-white text-blue-600 text-center py-2 px-4 rounded-lg font-semibold shadow-lg">
                      Explore Collection
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrandsCarousel;
