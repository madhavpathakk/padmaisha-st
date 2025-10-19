
import Link from 'next/link';
import Footer from '@/components/Footer';


import HeroBanner from '@/components/HeroBanner';
import PremiumBrandsGrid from '@/components/PremiumBrandsGrid';



export default function BrandsPage() {
		return (
			<main className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#f3e9e9] to-[#e9e3f3] w-full">
				<div className="sticky top-0 z-50 w-full bg-gradient-to-r from-white via-blue-50 to-pink-50 border-b border-gray-200 shadow-md px-4 py-3 flex items-center justify-between animate-fade-in-down">
					<Link href="/" prefetch className="font-extrabold text-lg text-blue-700 hover:text-pink-600 transition">← Back to Homepage</Link>
				</div>
				<div className="min-h-screen w-full bg-white">
					<div className="w-full px-2 sm:px-4 md:px-8">
						<div className="text-center mb-8 mt-12 w-full animate-fade-in-up">
							<h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-3 font-serif drop-shadow-lg">Our Premium Brands</h2>
							<p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-light mb-2">
								Discover exclusive fashion brands for every season,<br /> curated for retailers who demand quality and style.
							</p>
							<div className="mt-4 mb-8 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white text-sm font-medium shadow-lg inline-block animate-slide-in-up">
								Exclusive Brands for Retailers | Free Returns | Free Shipping Above ₹2000
							</div>
						</div>
						<section className="rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg p-4 sm:p-8 border border-gray-200 animate-fade-in-up">
							<PremiumBrandsGrid />
						</section>
					</div>
					<Footer />
				</div>
			</main>
		);
	}
