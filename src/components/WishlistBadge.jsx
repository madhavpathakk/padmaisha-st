export default function WishlistBadge({ count }) {
  return (
    <div className="flex items-center">
      <svg
        className="w-7 h-7 text-pink-400"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      {count > 0 && (
        <span className="absolute top-0 right-0 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
          {count}
        </span>
      )}
    </div>
  );
}
