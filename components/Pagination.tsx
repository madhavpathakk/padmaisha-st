import React from "react";

export default function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">Prev</button>
      <span className="px-3">Page {page} of {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">Next</button>
    </div>
  );
}
