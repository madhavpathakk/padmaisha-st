export default function ContactButton({ email, phone }: { email: string, phone: string }) {
  const handleEmail = () => {
    window.location.href = `mailto:${email}`;
  };
  const handleSMS = () => {
    window.location.href = `sms:${phone}`;
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(`${email} ${phone}`);
    alert('Copied to clipboard!');
  };
  return (
    <div style={{display: 'flex', gap: 8}}>
      <button onClick={handleEmail}>Email</button>
      <button onClick={handleSMS}>SMS</button>
      <button onClick={handleCopy}>Copy</button>
    </div>
  );
}
