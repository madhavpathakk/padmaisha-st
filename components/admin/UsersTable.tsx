import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.toLowerCase().includes(search.toLowerCase())
  );

  if (!users.length) return <div>No users found.</div>;

  return (
    <div style={{marginBottom: 32}}>
      <input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} style={{marginBottom: 12}} />
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>GST No</th>
            <th>Status</th><th>Last Updated</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>{user.gst_no}</td>
              <td>
                {user.status?.contacted && <span>Contacted </span>}
                {user.status?.fulfilled && <span>Fulfilled </span>}
                {user.status?.order_placed && <span>Order Placed</span>}
              </td>
              <td>{user.updated_at}</td>
              <td>{/* Edit/View modals, contact button, etc. */}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
