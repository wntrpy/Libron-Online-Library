// frontend/src/pages/member/Borrows.jsx
import React, { useEffect, useMemo, useState } from 'react';
import MemberHeader from '../../components/member/MemberHeader';
import MemberFooter from '../../components/member/MemberFooter';
import BorrowCard from '../../components/member/BorrowCard';

const howToBorrowSteps = [
  {
    number: 1,
    title: 'Borrow Online',
    description:
      'Pick a book you like from the catalog and click Borrow. It immediately appears under your Pending tab.',
  },
  {
    number: 2,
    title: 'Wait for Confirmation',
    description:
      'The librarian reviews your request. You can track the approval status in the Pending tab.',
  },
  {
    number: 3,
    title: 'Pickup & Scan',
    description:
      'Once approved, the librarian converts it into an active borrow. Pick it up at the desk and get it scanned.',
  },
  {
    number: 4,
    title: 'Return',
    description:
      'Bring it back on or before the due date. Once marked Returned by the librarian, it moves to History.',
  },
];

const STATUS_TO_TAB = {
  pending: 'pending',
  approved: 'active',
  overdue: 'overdue',
  rejected: 'history',
  returned: 'history',
};

const STATUS_BADGES = {
  pending: { label: 'Waiting for librarian', type: 'pending' },
  approved: { label: 'Borrowed', type: 'dueOk' },
  overdue: { label: 'Overdue', type: 'overdue' },
  rejected: { label: 'Request Rejected', type: 'dueSoon' },
  returned: { label: 'Returned', type: 'returned' },
};

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatDueIn = (days) => {
  if (days === null || days === undefined) return null;
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due in 1 day';
  return `Due in ${days} days`;
};

const mapRequestToCard = (request) => {
  const { book, member, status, due_in_days: dueInDays } = request;
  const badge = STATUS_BADGES[status] ?? STATUS_BADGES.pending;
  const extraDetails = [];

  if (status === 'pending') {
    extraDetails.push({
      label: 'Requested On',
      value: formatDate(request.requested_at) ?? 'Pending date',
    });
  }

  if (status === 'approved' || status === 'overdue') {
    const dueDate = new Date(request.due_date);
    extraDetails.push({
      label: 'Due Date',
      value: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
  }

  if (status === 'approved') {
    const dueIn = formatDueIn(dueInDays);
    if (dueIn) {
      extraDetails.push({ label: 'Due In', value: dueIn });
    }
  }

  if (status === 'returned' || status === 'rejected') {
    const label = status === 'returned' ? 'Returned On' : 'Reviewed On';
    const value =
      formatDate(request.returned_at || request.updated_at) ?? 'N/A';
    extraDetails.push({ label, value });
    if (status === 'rejected' && request.rejection_reason) {
      extraDetails.push({
        label: 'Reason',
        value: request.rejection_reason,
      });
    }
  }

  let statusType = badge.type;
  if (status === 'approved' && typeof dueInDays === 'number') {
    if (dueInDays < 0) {
      statusType = 'overdue';
    } else if (dueInDays <= 2) {
      statusType = 'dueSoon';
    } else {
      statusType = 'dueOk';
    }
  }

  return {
    requestId: request.id,
    bookTitle: book?.title ?? 'Unknown Book',
    bookId: book?.id ? `BK-${book.id}` : 'N/A',
    author: book?.author,
    memberId: member?.student_number ?? 'N/A',
    dateBorrowed:
      status === 'pending'
        ? `Requested ${formatDate(request.requested_at) ?? ''}`.trim()
        : formatDate(request.date_borrowed),
    dueDate: formatDate(request.due_date),
    extraDetails,
    statusLabel:
      status === 'approved' && formatDueIn(dueInDays)
        ? formatDueIn(dueInDays)
        : badge.label,
    statusType,
    actionLabel: status === 'returned' ? 'Borrow Again' : undefined,
  };
};

export default function Borrows() {
  const [activeTab, setActiveTab] = useState('active');
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQueries, setSearchQueries] = useState({
    active: '',
    pending: '',
    overdue: '',
    history: '',
  });

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }, []);
  const memberId = storedUser?.member_id;

  useEffect(() => {
    const controller = new AbortController();

    const fetchBorrows = async () => {
      if (!memberId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:8000/api/borrow-requests/?member_id=${memberId}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Failed to load borrow requests.');
        }

        const data = await response.json();
        setBorrowRequests(Array.isArray(data) ? data : data.results ?? []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(
            err.message ||
            'Something went wrong while fetching borrow requests.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();

    return () => controller.abort();
  }, [memberId]);

  const groupedBorrows = useMemo(() => {
    const groups = {
      active: [],
      pending: [],
      overdue: [],
      history: [],
    };

    borrowRequests.forEach((request) => {
      if (request.status === 'approved' && request.due_in_days < 0) {
        groups.overdue.push(mapRequestToCard({ ...request, status: 'overdue' }));
      } else {
        const tabKey = STATUS_TO_TAB[request.status] ?? 'pending';
        if (groups[tabKey]) {
          groups[tabKey].push(mapRequestToCard(request));
        }
      }
    });

    return groups;
  }, [borrowRequests]);

  const tabs = [
    { key: 'active', label: 'Active Borrowed Books', count: groupedBorrows.active.length },
    { key: 'pending', label: 'Pending Books', count: groupedBorrows.pending.length },
    { key: 'overdue', label: 'Overdue Books', count: groupedBorrows.overdue.length },
    { key: 'history', label: 'History', count: groupedBorrows.history.length },
  ];

  const filteredLists = useMemo(() => {
    const result = {
      active: [],
      pending: [],
      overdue: [],
      history: [],
    };

    Object.keys(result).forEach((tabKey) => {
      const query = searchQueries[tabKey]?.trim().toLowerCase();
      const baseList = groupedBorrows[tabKey] ?? [];

      if (!query) {
        result[tabKey] = baseList;
        return;
      }

      result[tabKey] = baseList.filter((item) => {
        const title = item.bookTitle?.toLowerCase() ?? '';
        const author = item.author?.toLowerCase() ?? '';
        return title.includes(query) || author.includes(query);
      });
    });

    return result;
  }, [groupedBorrows, searchQueries]);

  const currentList = filteredLists[activeTab] ?? [];
  const currentSearch = searchQueries[activeTab] ?? '';

  const handleSearchChange = (tabKey, value) => {
    setSearchQueries((prev) => ({
      ...prev,
      [tabKey]: value,
    }));
  };

  const handleBorrowAgain = async (bookId) => {
    if (!memberId) {
      console.error('No member ID found');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/borrow-requests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book_id: parseInt(bookId),
          member_id: memberId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.detail || 'Failed to send borrow request.';
        throw new Error(message);
      }

      // Refresh the borrow requests
      const updatedResponse = await fetch(
        `http://localhost:8000/api/borrow-requests/?member_id=${memberId}`
      );

      if (updatedResponse.ok) {
        const data = await updatedResponse.json();
        setBorrowRequests(Array.isArray(data) ? data : data.results ?? []);
        setActiveTab('pending'); // Switch to pending tab to show the new request
      } else {
        throw new Error('Failed to refresh borrow requests');
      }
    } catch (err) {
      console.error('Error borrowing book again:', err);
      setError(err.message || 'Failed to borrow book. Please try again.');
    }
  };

  return (
    <>
      <MemberHeader />
      <main className="min-h-screen bg-slate-50 pt-36 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
                Borrow a Book
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  Track your borrowed books in one place
                </h1>
              </div>
              <p className="mt-3 max-w-3xl text-slate-500">
                Switch between Active, Pending, and History tabs to view the status of every book
                you requested.
              </p>
            </div>
          </header>

          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  How to Borrow a Book?
                </h2>
                <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
                  Quick Guide
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {howToBorrowSteps.map((step) => (
                  <div
                    key={step.number}
                    className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-xl font-bold text-slate-900">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-wrap gap-8 text-lg font-semibold text-slate-400">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`pb-3 transition ${isActive
                          ? 'text-blue-600'
                          : 'text-slate-400 hover:text-slate-600'
                          }`}
                      >
                        {tab.label}{' '}
                        <span className="text-sm font-normal text-slate-400">
                          ({tab.count})
                        </span>
                        {isActive && (
                          <span className="mt-3 block h-1 w-full rounded-full bg-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm text-slate-500">
                  Showing {currentList.length} items
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                      Search {tabs.find((tab) => tab.key === activeTab)?.label ?? ''}
                    </p>
                    <p className="text-sm text-slate-500">
                      Filter by title or author. Results stay within this tab.
                    </p>
                  </div>
                  <div className="relative w-full sm:max-w-xs">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </span>
                    <input
                      type="search"
                      value={currentSearch}
                      onChange={(event) => handleSearchChange(activeTab, event.target.value)}
                      placeholder="Search this list..."
                      className="h-12 w-full rounded-full border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-600 outline-none transition focus:border-blue-500"
                    />
                  </div>
                </div>
                {!memberId ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
                    Sign in as a member to see your borrow history.
                  </div>
                ) : loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((skeleton) => (
                      <div
                        key={skeleton}
                        className="h-32 animate-pulse rounded-2xl bg-slate-100"
                      />
                    ))}
                  </div>
                ) : error ? (
                  <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
                    {error}
                  </div>
                ) : currentList.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
                    Nothing to show here yet. Borrow a book to see it appear in this tab.
                  </div>
                ) : (
                  currentList.map((borrow) => (
                    <BorrowCard
                      key={borrow.requestId ?? borrow.bookId + borrow.statusLabel}
                      {...borrow}
                      onAction={() => handleBorrowAgain(borrow.bookId.replace('BK-', ''))}
                    />
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <MemberFooter />
    </>
  );
}