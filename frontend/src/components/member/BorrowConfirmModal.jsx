// frontend/src/components/member/BorrowConfirmModal.jsx
import React from 'react';

export default function BorrowConfirmModal({
  isOpen,
  book,
  isSubmitting,
  onConfirm,
  onCancel,
}) {
  if (!isOpen || !book) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
                Borrow Confirmation
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Send request to librarian?
              </h2>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <span className="sr-only">Close</span>
              ✕
            </button>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">You are borrowing</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{book.title}</p>
            <p className="text-sm text-slate-500">by {book.author || 'Unknown author'}</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Available Copies
                </p>
                <p className="font-medium text-slate-900">
                  {book.available_copies ?? 0}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Genre
                </p>
                <p className="font-medium text-slate-900">{book.genre || 'Not specified'}</p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            The librarian will review your request, set a due date, and move the book to your
            Active Borrowed list once approved. You will see the pending status immediately.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className={`w-full rounded-full px-5 py-3 text-sm font-semibold text-white transition sm:w-auto ${
                isSubmitting
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Confirm Borrow'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

