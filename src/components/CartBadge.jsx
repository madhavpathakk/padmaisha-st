export default function CartBadge({ count }) {
  return (
    <div className="flex items-center">
      <svg
        className="w-7 h-7 text-red-400"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14l.84-2h7.99l.84 2H7.16zM6 6h15l-1.5 9H7.16l-1.1-2.32L4 6H2V4h2l3.6 7.59L6.16 14H19c.55 0 1-.45 1-1s-.45-1-1-1H7.16z"/>
      </svg>
      {count > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
          {count}
        </span>
      )}
    </div>
  );
}
