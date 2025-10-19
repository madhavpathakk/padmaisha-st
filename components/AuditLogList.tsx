import { useEffect, useState } from "react";
import { DocumentData, collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
export default function AuditLogList() {
  const [logs, setLogs] = useState<DocumentData[]>([]);
  useEffect(() => {
    const q = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(50));
    const unsub = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsub();
  }, []);
  return (
    <div className="bg-white dark:bg-[#23232b] rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Recent Changes</h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {logs.map((log, idx) => (
          <li key={idx} className="py-2">
            <span className="font-semibold">{log.action}</span> by <span className="text-blue-600">{log.userId}</span> at {new Date(log.timestamp?.seconds * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
