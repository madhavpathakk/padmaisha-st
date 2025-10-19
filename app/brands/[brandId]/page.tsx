import BrandProductsClient from './BrandProductsClient';

// Server component wrapper for static export
export default function BrandProductsPage() {
  return <BrandProductsClient />;
}

// For static export: generate all brandId params
export async function generateStaticParams() {
  // You should fetch or import your brands data here. For demo, hardcode a few:
  const brands = [
    { id: 'brand-1' },
    { id: 'brand-2' },
    // Add all your real brand IDs here, or import from your data source
  ];
  return brands.map(brand => ({ brandId: brand.id }));
}