import React from "react";

const advantages = [
	"Premium B2B clothing at affordable prices",
	"Exclusive brands for unique retail offerings",
	"High-quality materials ensuring durability",
	"Wide variety of styles to suit all preferences",
	"Competitive pricing for bulk purchases",
	"Fast and reliable delivery services",
	"Easy integration with retail inventory systems",
	"Regular updates with the latest fashion trends",
	"Excellent customer support for retailers",
	"Special discounts and loyalty programs for customers",
];

export default function AdvantagesCarousel() {
	return (
		<div className="relative w-full overflow-hidden bg-gray-900 py-4">
			<div className="flex whitespace-nowrap animate-marquee" style={{ minWidth: "200%" }}>
				{advantages.map((adv, idx) => (
					<span
						key={idx}
						className="mx-8 text-lg text-white font-semibold"
					>
						{adv}
					</span>
				))}
				{/* Duplicate for seamless loop */}
				{advantages.map((adv, idx) => (
					<span
						key={`dup-${idx}`}
						className="mx-8 text-lg text-white font-semibold"
					>
						{adv}
					</span>
				))}
			</div>
			<style>{`
				@keyframes marquee {
					0% { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}
				.animate-marquee {
					animation: marquee 30s linear infinite;
				}
			`}</style>
		</div>
	);
}
