import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function RevenueCard() {
  const [revenue, setRevenue] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "revenue", "totals"), (snap) => {
      setRevenue(snap.data());
    });
    return () => unsub();
  }, []);

  if (!revenue) return <div>Loading revenue...</div>;

  return (
    <div style={{marginBottom: 32}}>
      <h2>Total Revenue: ₹{revenue.total_revenue?.toFixed(2) || 0}</h2>
      <div>
        <h3>Monthly Breakdown</h3>
        <ul>
          {revenue.monthly_breakdown && Object.entries(revenue.monthly_breakdown).map(([month, value]) => (
            <li key={month}>{month}: ₹{(Number(value)).toFixed(2)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
