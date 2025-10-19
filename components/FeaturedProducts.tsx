"use client";
import React from "react";
import { useApp } from "@/contexts/AppContext";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
	const { state } = useApp();
	const products = state.products || [];

	if (!products.length) {
		return null;
	}

	return (
		<section className="mt-16">
			<h2 className="text-2xl font-bold text-gray-900 mb-8">Discover our complete collection of premium B2B fashion</h2>
			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				{products.map(product => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
		);
	};

export default FeaturedProducts;
