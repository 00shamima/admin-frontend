import React, { useState, useEffect, useCallback } from "react";
import apiService from "../api/apiService";

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Format date
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString();

  // 🔥 FETCH CONTACT MESSAGES (WITH JWT)
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");

      const response = await apiService.get(
        `/contact?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(response.data.contacts || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      console.error(
        "Fetch error:",
        err.response?.data || err.message
      );
      setError("Failed to load contact messages. Check API/Auth.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // 🔥 DELETE CONTACT
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      await apiService.delete(`/contact/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchMessages();
    } catch (err) {
      console.error(
        "Delete error:",
        err.response?.data || err.message
      );
      alert("Failed to delete message");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow rounded">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">
        ✉️ Contact Messages
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500">No contact messages found.</p>
      ) : (
        <>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="border rounded p-4 bg-gray-50"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {msg.name}
                    </h3>
                    <p className="text-sm text-blue-600">
                      {msg.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(msg.createdAt)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>

                <p className="mt-3 text-gray-700 whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600">
              Showing {messages.length} of {total}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span>
                Page {page} of {totalPages || 1}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminContacts;
