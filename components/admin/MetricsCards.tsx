export default function MetricsCards({ totalUsers, activeOrders, pendingContacts, avgOrderValue }: { totalUsers: number, activeOrders: number, pendingContacts: number, avgOrderValue: number }) {
  return (
    <div style={{display: 'flex', gap: 16, marginBottom: 32}}>
      <div style={{padding: 16, background: '#f5f5f5', borderRadius: 8}}>
        <div>Total Users</div>
        <div style={{fontWeight: 'bold', fontSize: 24}}>{totalUsers}</div>
      </div>
      <div style={{padding: 16, background: '#f5f5f5', borderRadius: 8}}>
        <div>Active Orders</div>
        <div style={{fontWeight: 'bold', fontSize: 24}}>{activeOrders}</div>
      </div>
      <div style={{padding: 16, background: '#f5f5f5', borderRadius: 8}}>
        <div>Pending Contacts</div>
        <div style={{fontWeight: 'bold', fontSize: 24}}>{pendingContacts}</div>
      </div>
      <div style={{padding: 16, background: '#f5f5f5', borderRadius: 8}}>
        <div>Avg Order Value</div>
        <div style={{fontWeight: 'bold', fontSize: 24}}>₹{avgOrderValue.toFixed(2)}</div>
      </div>
    </div>
  );
}
