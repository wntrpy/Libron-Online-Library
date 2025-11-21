// frontend/src/components/member/BorrowCard.jsx
import React from 'react';

const STATUS_STYLES = {
  dueOk: 'bg-green-50 text-green-700 border border-green-100',
  dueSoon: 'bg-amber-50 text-amber-700 border border-amber-100',
  overdue: 'bg-red-50 text-red-600 border border-red-100',
  pending: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
  returned: 'bg-slate-100 text-slate-600 border border-slate-200',
};

export default function BorrowCard({
  bookTitle,
  author,
  memberId,
  bookId,
  dateBorrowed,
  dueDate,
  extraDetails = [],
  statusLabel,
  statusType = 'dueOk',
  actionLabel,
  onAction = () => { },
}) {
  const statusClassName =
    STATUS_STYLES[statusType] ?? STATUS_STYLES.dueOk;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-semibold text-slate-900">
            {bookTitle}
          </h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Book ID: {bookId}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Member ID: {memberId}
          </span>
        </div>
        {author && (
          <p className="mt-1 text-sm text-slate-500">
            by {author}
          </p>
        )}

        <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          {dateBorrowed && (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Date Borrowed
              </p>
              <p className="font-medium text-slate-800">{dateBorrowed}</p>
            </div>
          )}
          {dueDate && (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Due Date
              </p>
              <p className="font-medium text-slate-800">{dueDate}</p>
            </div>
          )}
          {extraDetails.map((detail) => (
            <div key={detail.label}>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {detail.label}
              </p>
              <p className="font-medium text-slate-800">
                {detail.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 md:items-end">
        {statusLabel && (
          <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusClassName}`}>
            {statusLabel}
          </span>
        )}

        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="w-full rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 md:w-auto"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </article>
  );
}

