"use client";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/components/firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (!firebaseUser) {
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }
  if (!user) {
    return null;
  }
  // Brand names for marquee
  const brandNames = [
    "Urja & WACCHI", "Lasoon", "Radhika", "Jssur", "Avangard", "B-22", "Oakberry", "Domex Club", "E Zinna", "Betty-11", "Miss Eney", "Prinzy", "Pampara", "5 Rivers", "Yushika", "Amba Jee"
  ];
  // Brand cards data
  const brands = brandNames.map((name, idx) => ({
    name,
    img: `/brands/${name.toLowerCase().replace(/[^a-z0-9]/g, "").replace(/\s+/g, "")}.jpg`
  }));
  return (
    <div className="min-h-screen bg-gray-50 py-8 w-full">
      <section className="w-full px-2 sm:px-4 md:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 w-full">Our Premium Brands</h2>
        <p className="text-center text-gray-500 mb-8 w-full">Discover exclusive fashion brands for every season</p>
        {/* Marquee animation for brand names */}
        <div className="w-full overflow-hidden mb-8">
          <div className="relative w-full h-10 flex items-center">
            <div className="animate-marquee whitespace-nowrap text-lg font-semibold text-pink-600">
              {brandNames.concat(brandNames).map((name, idx) => (
                <span key={name + idx} className="mx-8 inline-block">{name}</span>
              ))}
            </div>
          </div>
        </div>
        {/* Consistent grid for brand cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4"
          style={{
            gridAutoRows: '1fr',
            alignItems: 'stretch',
            justifyItems: 'center',
          }}
        >
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex flex-col bg-white rounded-xl shadow-md w-full max-w-[320px] h-[420px] transition-transform hover:scale-105"
              style={{ boxSizing: 'border-box', minHeight: '420px', height: '420px', width: '100%', maxWidth: '320px', justifyContent: 'space-between' }}
            >
              <div className="w-full aspect-square bg-gray-100 rounded-t-xl overflow-hidden flex items-center justify-center" style={{height: '180px'}}>
                <img
                  src={brand.img}
                  alt={brand.name}
                  className="object-cover w-full h-full"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center w-full px-6 py-3">
                <div className="text-lg font-semibold text-center mb-1">{brand.name}</div>
                <div className="text-xs text-gray-500 mb-1">Winter</div>
              </div>
              <div className="w-full px-6 pb-4">
                <button className="w-full px-4 py-2 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600 transition">Explore Collection</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

