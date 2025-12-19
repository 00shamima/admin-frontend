import React, { useState, useEffect, useCallback } from "react";
import apiService from "../api/apiService";

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // FIX: local storage-il irundhu 'token' edukkavum
      const token = localStorage.getItem("token"); 

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
      console.error("Fetch error:", err.response?.data || err.message);
      setError("Failed to load contact messages.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      const token = localStorage.getItem("token");
      await apiService.delete(`/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMessages();
    } catch (err) {
      alert("Failed to delete message");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow rounded text-gray-800">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">✉️ Contact Messages</h2>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="border rounded p-4 bg-gray-50 flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{msg.name} ({msg.email})</h3>
                <p className="text-xs text-gray-500">{formatDate(msg.createdAt)}</p>
                <p className="mt-2 text-gray-700">{msg.message}</p>
              </div>
              <button onClick={() => handleDelete(msg.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          ))}
          {/* Pagination Controls */}
          <div className="flex justify-between mt-6">
             <button disabled={page === 1} onClick={() => setPage(page-1)} className="px-4 py-2 border rounded disabled:opacity-50">Previous</button>
             <span>Page {page} of {totalPages}</span>
             <button disabled={page === totalPages} onClick={() => setPage(page+1)} className="px-4 py-2 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;