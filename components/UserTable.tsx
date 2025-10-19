"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "./Pagination";
import { User } from "../models/user";
import UserEditModal from "./UserEditModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { BadgeCheck, BadgeX, Search, SortAsc, SortDesc } from "lucide-react";

export default function UserTable({ users, loading, error }: { users: any[]; loading: boolean; error?: string }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string|null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState<'asc'|'desc'>("desc");
  const pageSize = 10;
  const filtered = useMemo(() => users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.toLowerCase().includes(search.toLowerCase())
  ), [users, search]);
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === "created_at" && aVal?.seconds && bVal?.seconds) {
        aVal = aVal.seconds;
        bVal = bVal.seconds;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [filtered, sortBy, sortDir]);
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <div className="p-8 text-lg text-gray-400 animate-pulse">Loading users...</div>;
  if (error) return <div className="p-8 text-lg text-red-500">{error}</div>;
  if (!users.length) return <div className="p-8 text-lg text-gray-500">No users found.</div>;

  const tableAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const rowAnimation = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto bg-gradient-to-br from-[#23232b] via-[#2d2d3a] to-[#23232b] rounded-xl shadow-xl p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
      >
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users..."
            className="pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full text-sm bg-[#18181b] text-white placeholder:text-gray-400"
            aria-label="Search users"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="overflow-x-auto"
      >
        <table className="min-w-full divide-y divide-gray-700 dark divide-gray-800 rounded-xl text-sm">
          <thead className="bg-[#23232b]">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-300 cursor-pointer" onClick={() => {setSortBy('avatar');}} aria-label="Avatar">Avatar</th>
              <motion.th
                whileHover={{ scale: 1.02 }}
                scope="col"
                className="px-4 py-3 text-left font-semibold text-gray-300 cursor-pointer flex items-center gap-1"
                onClick={() => {setSortBy('name'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}}
                aria-label="Name"
              >
                Name {sortBy === 'name' && (sortDir === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />)}
              </motion.th>
              <motion.th
                whileHover={{ scale: 1.02 }}
                scope="col"
                className="px-4 py-3 text-left font-semibold text-gray-300 cursor-pointer flex items-center gap-1"
                onClick={() => {setSortBy('phone'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}}
                aria-label="Phone"
              >
                Phone {sortBy === 'phone' && (sortDir === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />)}
              </motion.th>
              <motion.th
                whileHover={{ scale: 1.02 }}
                scope="col"
                className="px-4 py-3 text-left font-semibold text-gray-300 cursor-pointer flex items-center gap-1"
                onClick={() => {setSortBy('address'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}}
                aria-label="Address"
              >
                Address {sortBy === 'address' && (sortDir === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />)}
              </motion.th>
              <motion.th
                whileHover={{ scale: 1.02 }}
                scope="col"
                className="px-4 py-3 text-left font-semibold text-gray-300 cursor-pointer flex items-center gap-1"
                onClick={() => {setSortBy('gst_no'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}}
                aria-label="GST"
              >
                GST {sortBy === 'gst_no' && (sortDir === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />)}
              </motion.th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-300" aria-label="Items Ordered">Items Ordered</th>
              <motion.th
                whileHover={{ scale: 1.02 }}
                scope="col"
                className="px-4 py-3 text-left font-semibold text-gray-300 cursor-pointer flex items-center gap-1"
                onClick={() => {setSortBy('total'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}}
                aria-label="Total"
              >
                Total {sortBy === 'total' && (sortDir === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />)}
              </motion.th>
              <motion.th
                whileHover={{ scale: 1.02 }}
                scope="col"
                className="px-4 py-3 text-left font-semibold text-gray-300 cursor-pointer flex items-center gap-1"
                onClick={() => {setSortBy('created_at'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}}
                aria-label="Created At"
              >
                Created At {sortBy === 'created_at' && (sortDir === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />)}
              </motion.th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-300" aria-label="Status">Status</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-300" aria-label="Actions">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#18181b] divide-y divide-gray-800">
            <AnimatePresence>
              {paginated.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  variants={rowAnimation}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, x: 20 }}
                  className={idx%2===0 ? "bg-[#23232b]" : ""}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                >
                  <td className="px-4 py-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      aria-label={`Avatar for ${user.name}`}
                    >
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </motion.div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">{user.name}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {(() => {
                      if (user.phone && user.phone !== "Not filled")
                        return <motion.a whileHover={{ scale: 1.05 }} href={`tel:${user.phone}`} className="underline">{user.phone}</motion.a>;
                      if (user.user?.phone && user.user.phone !== "Not filled")
                        return <motion.a whileHover={{ scale: 1.05 }} href={`tel:${user.user.phone}`} className="underline">{user.user.phone}</motion.a>;
                      return "-";
                    })()}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {(() => {
                      if (typeof user.address === "object" && user.address !== null) {
                        return user.address.address || user.address.name || "-";
                      }
                      if (user.address && user.address !== "Not filled") return user.address;
                      if (user.user?.address && user.user.address !== "Not filled") return user.user.address;
                      return "-";
                    })()}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {(() => {
                      if (user.gst_no && user.gst_no !== "Not filled") return user.gst_no;
                      if (user.gst && user.gst !== "Not filled") return user.gst;
                      if (user.user?.gst && user.user.gst !== "Not filled") return user.user.gst;
                      return "-";
                    })()}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {(() => {
                      let items = user.order_details?.items || user.items || user.user?.items || [];
                      if (Array.isArray(items) && items.length > 0) {
                        return (
                          <motion.ul
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="list-disc ml-4"
                          >
                            {items.map((item: any, idx: number) => (
                              <motion.li
                                key={idx}
                                initial={{ x: -10 }}
                                animate={{ x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                              >
                                {item.name} x {item.quantity || 1}
                              </motion.li>
                            ))}
                          </motion.ul>
                        );
                      }
                      return "-";
                    })()}
                  </td>
                  <td className="px-4 py-3 font-bold text-green-400">
                    {(() => {
                      if (typeof user.order_details?.total_amount === 'number')
                        return <motion.span whileHover={{ scale: 1.1 }}>₹{user.order_details.total_amount}</motion.span>;
                      if (typeof user.total === 'number')
                        return <motion.span whileHover={{ scale: 1.1 }}>₹{user.total}</motion.span>;
                      if (typeof user.user?.total === 'number')
                        return <motion.span whileHover={{ scale: 1.1 }}>₹{user.user.total}</motion.span>;
                      return "-";
                    })()}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {user.created_at && user.created_at.seconds
                      ? new Date(user.created_at.seconds * 1000).toLocaleString()
                      : (user.created_at && user.created_at !== "Not filled" ? String(user.created_at) : "-")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {['contacted', 'fulfilled', 'order_placed', 'returned', 'replaced'].map((status) => (
                        <motion.span
                          key={status}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                            user.status?.[status] ? "bg-green-600 text-white" : "bg-red-600 text-white"
                          }`}
                        >
                          {user.status?.[status] ? (
                            <BadgeCheck className="inline-block" size={14} />
                          ) : (
                            <BadgeX className="inline-block" size={14} />
                          )}
                          <span>{status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}</span>
                        </motion.span>
                      ))}
                    </div>
                    {user.status?.notes && (
                      <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="block px-2 py-1 rounded-full text-xs font-medium bg-purple-600 text-white border border-purple-300 mt-1"
                      >
                        <b>Note:</b> {user.status.notes}
                      </motion.span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setSelectedUser(user); setEditMode(true); }}
                        className="bg-blue-600 text-white px-3 py-1 rounded-full shadow hover:bg-blue-700 transition text-xs"
                        aria-label={`Edit ${user.name}`}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this user?')) {
                            setDeleteLoading(user.id);
                            try {
                              const { db } = await import("@/lib/firebase");
                              const { doc, deleteDoc } = await import("firebase/firestore");
                              await deleteDoc(doc(db, "orders", user.id));
                              setDeleteLoading(null);
                              window.location.reload();
                            } catch (err) {
                              setDeleteLoading(null);
                              alert("Failed to delete user.");
                            }
                          }
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded-full shadow hover:bg-red-700 transition text-xs"
                        disabled={deleteLoading === user.id}
                        aria-label={`Delete ${user.name}`}
                      >
                        {deleteLoading === user.id ? "Deleting..." : "Delete"}
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 flex justify-center"
      >
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </motion.div>
      <AnimatePresence>
        {selectedUser && editMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <UserEditModal
              user={selectedUser}
              onClose={() => { setSelectedUser(null); setEditMode(false); }}
              allowEditDetails={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
