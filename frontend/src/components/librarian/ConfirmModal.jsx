import React from "react";

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded" onClick={onCancel}>Cancel</button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
