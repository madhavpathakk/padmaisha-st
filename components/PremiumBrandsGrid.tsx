"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';


const brandImageMap: Record<string, string> = {
	'urja-wacchi': '/brands/urjaa.jpg',
	'lasoon': '/brands/lasoon.jpeg',
	'radhika': '/brands/radhika fashion.jpg',
	'avangard': '/brands/wachi.jpg',
	'b-52': '/brands/b-52 fashion.jpg',
	'oakberry': '/brands/lasoon feminine.jpg',
	'domex-club': '/brands/e-zennia.jpg',
	'e-zinna': '/brands/e-zennia.jpg',
	'belly-11': '/brands/belly-11.jpg',
	'miss-eney': '/brands/soulwin.jpeg',
	'princy': '/brands/amba jee.jpeg',
	'pampara': '/brands/pampara.jpg',
	'5-rivers': '/brands/5 rivers .jpg',
	'amba-jee': '/brands/amba jee.jpeg',
	'soulwin': '/brands/soulwin.jpeg',
};

const PremiumBrandsGrid: React.FC = () => {
	const { state } = useApp();
	const brands = state.brands || [];


	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
			{brands.map((brand, idx) => {
				const imageSrc = brandImageMap[brand.id] || brand.image;
				return (
					<Card
						key={brand.id}
						className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-fade-in-up"
						style={{ animationDelay: `${idx * 0.05}s` }}
					>
						<CardContent className="p-0 flex flex-col h-full">
							<Link href={`/brands/${brand.id}`} className="block h-full">
								<div className="relative overflow-hidden rounded-t-xl h-48 sm:h-56">
									<Image
										src={imageSrc}
										alt={brand.name}
										width={400}
										height={400}
										className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 bg-white"
										unoptimized
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
									<div className="absolute bottom-3 left-3 text-white">
										<h3 className="text-lg font-bold font-serif drop-shadow tracking-wide mb-1">{brand.name}</h3>
										<div className="flex gap-1 mt-1 flex-wrap">
											{brand.seasons.map((season: string) => (
												<span key={season} className="text-[10px] bg-white/30 px-2 py-0.5 rounded-full backdrop-blur border border-white/30 shadow">
													{season}
												</span>
											))}
										</div>
									</div>
								</div>
							</Link>
							<div className="px-4 pb-4 pt-2 mt-auto">
								<Link href={`/brands/${brand.id}`} className="block w-full">
									<Button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold shadow hover:scale-105 transition-transform duration-300 rounded-full text-sm py-1.5">
										Explore
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
};

export default PremiumBrandsGrid;
