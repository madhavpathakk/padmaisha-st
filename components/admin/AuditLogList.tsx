import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export default function AuditLogList() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    const q = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(10));
    const unsub = onSnapshot(q, (snap) => {
      setLogs(snap.docs.map(doc => doc.data()));
    });
    return () => unsub();
  }, []);
  return (
    <div style={{marginTop: 32}}>
      <h3>Recent Audit Logs</h3>
      <ul>
        {logs.map((log, i) => (
          <li key={i}>{log.action} - {log.userId} - {log.timestamp?.toDate?.().toString() || ""}</li>
        ))}
      </ul>
    </div>
  );
}
