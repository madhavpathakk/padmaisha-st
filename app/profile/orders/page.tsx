"use client";

import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { FiSearch, FiPackage, FiTruck, FiCalendar, FiMapPin } from "react-icons/fi";
import { getAuth } from "firebase/auth";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, onSnapshot, QuerySnapshot, DocumentChange } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import styles from '@/styles/orders.module.css';

type OrderItem = {
	name: string;
	image?: string;
	description?: string;
	quantity?: number;
};

type OrderType = {
	id: string;
	items: OrderItem[];
	address?: { address?: string };
	shipTo?: string;
	total?: number;
	status: string;
	reason?: string;
	userId?: string;
	createdAt?: number;
};

export default function OrdersPage() {
	const [orders, setOrders] = useState<OrderType[]>([]);
	const [search, setSearch] = useState<string>("");
	"use client";
	const [loading, setLoading] = useState(true);
	const [actionOrderId, setActionOrderId] = useState<string | null>(null);
	const [actionType, setActionType] = useState<"cancel" | "return" | "replace" | null>(null);
	const [reason, setReason] = useState<string>("");
	const [submitting, setSubmitting] = useState(false);

	const [user, setUser] = useState<any>(null);

		// Padmaisha branding info
		const PADMAISHA = {
			name: "Padmaisha Retail Pvt Ltd",
			address: "B/246 Sooraj bhan school, Rajendra Nagar Bareilly, Pin code - 243001",
			phone: "8979865001",
			alternatePhone: "9760025104",
			email: "padmaisha940@gmail.com",
			gst: "07ABCDE1234F1Z5",
			businessHours: "10:30 to 8:30 pm",
			logo: "/logo.png"
		};

	// PDF invoice generator
	async function generateInvoicePDF(order: OrderType) {
		const pdfDoc = await PDFDocument.create();
		const page = pdfDoc.addPage([600, 800]);
		const { width, height } = page.getSize();
		const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

			// Logo image (Padmaisha)
					try {
						// Use absolute URL for logo fetch to work in all environments
						const logoUrl = typeof window !== "undefined" ? window.location.origin + PADMAISHA.logo : PADMAISHA.logo;
						const logoImg = await fetch(logoUrl).then(res => res.arrayBuffer());
						const logoEmbed = await pdfDoc.embedPng(logoImg);
						page.drawImage(logoEmbed, {
							x: 40, y: height - 100,
							width: 60, height: 60
						});
						page.drawText(PADMAISHA.name, { x: 110, y: height - 50, size: 18, font });
						page.drawText(PADMAISHA.address, { x: 110, y: height - 70, size: 12, font });
						page.drawText(`Phone: ${PADMAISHA.phone} | GST: ${PADMAISHA.gst}`, { x: 110, y: height - 90, size: 12, font });
					} catch (e) {
						// fallback to text logo if image fails
						page.drawText("PA", {
							x: 40, y: height - 60,
							size: 32,
							color: rgb(0.42, 0.27, 0.76),
							font,
						});
						page.drawText(PADMAISHA.name, { x: 90, y: height - 50, size: 18, font });
						page.drawText(PADMAISHA.address, { x: 90, y: height - 70, size: 12, font });
						page.drawText(`Phone: ${PADMAISHA.phone} | GST: ${PADMAISHA.gst}`, { x: 90, y: height - 90, size: 12, font });
					}

		// Invoice title
		page.drawText("INVOICE", { x: width / 2 - 50, y: height - 120, size: 24, font, color: rgb(0.42, 0.27, 0.76) });

		// Order details
		let y = height - 160;
		page.drawText(`Order ID: ${order.id}`, { x: 40, y, size: 14, font });
		y -= 20;
		page.drawText(`Name: ${user?.displayName || "-"}`, { x: 40, y, size: 14, font });
		y -= 20;
		page.drawText(`Phone: ${user?.phoneNumber || "-"}`, { x: 40, y, size: 14, font });
		y -= 20;
		page.drawText(`Ship to: ${order.address?.address || order.shipTo || "-"}`, { x: 40, y, size: 14, font });
		y -= 20;
		page.drawText(`GST No: ${PADMAISHA.gst}`, { x: 40, y, size: 14, font });

		// Items table
		y -= 30;
		page.drawText("Items:", { x: 40, y, size: 14, font, color: rgb(0.42, 0.27, 0.76) });
		y -= 20;
		page.drawText("Name", { x: 40, y, size: 12, font });
		page.drawText("Qty", { x: 220, y, size: 12, font });
		page.drawText("Price", { x: 300, y, size: 12, font });
		page.drawText("Total", { x: 400, y, size: 12, font });
		y -= 16;
		order.items.forEach(item => {
			page.drawText(item.name, { x: 40, y, size: 12, font });
			page.drawText(String(item.quantity || 1), { x: 220, y, size: 12, font });
			page.drawText(`Rs. ${item.description?.match(/\d+/)?.[0] || "-"}`, { x: 300, y, size: 12, font });
			page.drawText(`Rs. ${order.total}`, { x: 400, y, size: 12, font });
			y -= 16;
		});

		// Fees and totals
		y -= 20;
			page.drawText(`Delivery Fees: Rs. 0`, { x: 40, y, size: 12, font });
			y -= 16;
			page.drawText(`Platform Fees: Rs. 0`, { x: 40, y, size: 12, font });
			y -= 16;
			page.drawText(`Net Total: Rs. ${order.total}`, { x: 40, y, size: 14, font, color: rgb(0.42, 0.27, 0.76) });

		// Status and reason
		y -= 30;
		page.drawText(`Status: ${order.status}`, { x: 40, y, size: 12, font });
		if (order.reason) {
			y -= 16;
			page.drawText(`Reason: ${order.reason}`, { x: 40, y, size: 12, font });
		}

		// Footer
		page.drawText("Thank you for shopping with Padmaisha!", { x: 40, y: 40, size: 14, font, color: rgb(0.42, 0.27, 0.76) });

			const pdfBytes = await pdfDoc.save();
			// Convert Uint8Array to ArrayBuffer for Blob compatibility
				const arrayBuffer = pdfBytes instanceof Uint8Array ? pdfBytes.slice().buffer : pdfBytes;
				const blob = new Blob([arrayBuffer], { type: "application/pdf" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `Padmaisha_Invoice_${order.id}.pdf`;
			document.body.appendChild(a);
			a.click();
			setTimeout(() => {
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			}, 100);
	}
	useEffect(() => {
		const fetchOrders = async () => {
			setLoading(true);
			try {
				const auth = getAuth();
				const currentUser = auth.currentUser;
				setUser(currentUser);
				if (!currentUser) {
					setOrders([]);
					setLoading(false);
					return;
				}

				// First try to get from admin orders collection
				const adminOrdersRef = collection(db, 'orders');
				const adminSnapshot = await getDocs(adminOrdersRef);
				const adminOrders = adminSnapshot.docs
					.map(doc => ({ id: doc.id, ...doc.data() } as OrderType))
					.filter(order => order.userId === currentUser.uid);

				// Also get from user's orders subcollection
				const userOrdersRef = collection(db, `users/${currentUser.uid}/orders`);
				const userSnapshot = await getDocs(userOrdersRef);
				const userOrders = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderType));

				// Combine and deduplicate orders
				const combinedOrders = [...adminOrders, ...userOrders];
				const uniqueOrders = Array.from(new Map(combinedOrders.map(order => [order.id, order])).values());

				// Sort by date (using createdAt or fallback to ID timestamp)
				const sortedOrders = uniqueOrders.sort((a, b) => {
					const timestampA = a.createdAt || parseInt(a.id.split('-')[0]);
					const timestampB = b.createdAt || parseInt(b.id.split('-')[0]);
					return timestampB - timestampA;
				});

				setOrders(sortedOrders);
			} catch (err) {
				console.error('Error fetching orders:', err);
				setOrders([]);
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();

		// Set up real-time listener for new orders
		const auth = getAuth();
		const currentUser = auth.currentUser;
		if (currentUser) {
			const userOrdersRef = collection(db, `users/${currentUser.uid}/orders`);
			const unsubscribe = onSnapshot(userOrdersRef, (snapshot) => {
				snapshot.docChanges().forEach((change) => {
					if (change.type === 'added') {
						setOrders(prev => {
							const newOrder = { id: change.doc.id, ...change.doc.data() } as OrderType;
							if (prev.find(o => o.id === newOrder.id)) return prev;
							return [newOrder, ...prev];
						});
					}
				});
			});

			return () => unsubscribe();
		}
	}, []);

	const filteredOrders = orders.filter(
		(order) =>
			order.id.includes(search) ||
			(order.items && order.items.some((item) => item.name?.toLowerCase().includes(search.toLowerCase())))
	);

	// Handle order action (cancel, return, replace)
	const handleOrderAction = async () => {
		if (!actionOrderId || !actionType || !reason.trim()) return;
		setSubmitting(true);
		try {
			const auth = getAuth();
			const user = auth.currentUser;
			if (!user) return;
			const orderDoc = doc(db, `users/${user.uid}/orders/${actionOrderId}`);
			let newStatus = "";
			if (actionType === "cancel") newStatus = "Cancelled";
			if (actionType === "return") newStatus = "Returned";
			if (actionType === "replace") newStatus = "Replaced";
			await updateDoc(orderDoc, { status: newStatus, reason });
			setOrders(orders => orders.map(order => order.id === actionOrderId ? { ...order, status: newStatus, reason } : order));

			// Sync to admin panel (global orders collection)
			const adminOrderDoc = doc(db, `orders/${actionOrderId}`);
			await updateDoc(adminOrderDoc, {
				status: newStatus,
				reason,
				user: {
					name: user.displayName || user.email || "-",
					email: user.email || "-",
					phone: user.phoneNumber || "-",
					uid: user.uid
				}
			});

			// Send email notification via Web3Forms
			const web3formsAccessKey = "ab6cd849-c4a1-4bd3-b511-b6997843473b";
			const order = orders.find(o => o.id === actionOrderId);
			const formData = new FormData();
			formData.append("access_key", web3formsAccessKey);
			formData.append("subject", `Order ${newStatus} Request - ${actionOrderId}`);
			formData.append("from_name", user.displayName || user.email || "Padmaisha User");
			formData.append("email", user.email || "support@padmaisha.com");
			formData.append("message", `Order ID: ${actionOrderId}\nAction: ${newStatus}\nReason: ${reason}\nUser: ${user.displayName || user.email}\nPhone: ${user.phoneNumber}\nItems: ${(order?.items || []).map(i => i.name).join(", ")}`);
			await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				body: formData
			});

			setActionOrderId(null);
			setActionType(null);
			setReason("");
		} catch (err) {
			// Handle error (optional toast)
		} finally {
			setSubmitting(false);
		}
	};

			return (
				<main className="min-h-screen w-full bg-gray-50 flex">
					{/* Sidebar navigation */}
					<aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 py-8 px-6">
						<div className="flex items-center gap-3 mb-8">
							  <img src="/logo.png" alt="Padmaisha Logo" className="w-12 h-12 rounded-full border" />
							<span className="font-bold text-xl text-[#B45309]">Padmaisha</span>
						</div>
						<nav className="flex flex-col gap-4">
							<a href="/profile/orders" className="font-semibold text-[#6B46C1]">Orders & Returns</a>
							<a href="/profile" className="text-gray-700 hover:text-[#B45309]">Profile</a>
							<a href="/profile/wishlist" className="text-gray-700 hover:text-[#B45309]">Wishlist</a>
							<a href="/profile/addresses" className="text-gray-700 hover:text-[#B45309]">Addresses</a>
						</nav>
					</aside>
					<section className="flex-1 px-2 md:px-12 py-10">
						<div className="flex justify-between items-center mb-8">
							<a href="/" className="font-extrabold text-xl text-blue-700 hover:text-pink-600 transition">← Back to Homepage</a>
							<div className="w-full max-w-lg relative">
								<input
									type="text"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder="Search orders"
									className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow focus:ring-2 focus:ring-purple-400 text-lg"
								/>
								<FiSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
							</div>
						</div>
						{!user ? (
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.7 }}
								className="flex flex-col items-center justify-center min-h-[300px] py-10"
							>
								<div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-pink-200">
									<h2 className="text-2xl font-bold text-pink-600 mb-4">Please login to view your orders</h2>
									<p className="text-gray-700 text-lg mb-4">Sign in to see your order history and details.</p>
									<Link href="/login?redirect=/profile/orders">
										<button className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow hover:bg-pink-600 transition">Login</button>
									</Link>
								</div>
							</motion.div>
						) : (
							<>
								<motion.h1
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.7 }}
									className="text-4xl font-extrabold mb-8 text-left text-[#6B46C1]"
								>
									Orders & Returns
								</motion.h1>
								{loading ? (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="text-center py-16 text-gray-500 text-xl"
									>
										Loading orders...
									</motion.div>
								) : filteredOrders.length === 0 ? (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="text-center py-16 text-gray-500 text-xl"
									>
										No orders found.
									</motion.div>
								) : (
									<div className="flex flex-col gap-6">
										{filteredOrders.map((order, idx) => (
											<motion.div
												key={order.id + '-' + idx}
												initial={{ opacity: 0, y: 40 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.5, delay: idx * 0.1 }}
												className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all order-card"
											>
												<div className="flex flex-col md:flex-row gap-6 w-full">
													{/* Status and Image Column */}
													<div className="flex md:flex-col items-start gap-4 md:w-48">
														{/* Status Badge */}
														<div className="order-status">
															{order.status === "Delivered" && (
																<span className="inline-flex items-center bg-green-100 text-green-700 rounded-full px-4 py-2 text-sm font-semibold">
																	<span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
																	Delivered
																</span>
															)}
															{order.status === "Pending" && (
																<span className="inline-flex items-center bg-yellow-100 text-yellow-700 rounded-full px-4 py-2 text-sm font-semibold animate-pulse">
																	<span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
																	Pending
																</span>
															)}
															{order.status === "Cancelled" && (
																<span className="inline-flex items-center bg-red-100 text-red-700 rounded-full px-4 py-2 text-sm font-semibold">
																	<span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
																	Cancelled
																</span>
															)}
															{order.status === "Returned" && (
																<span className="inline-flex items-center bg-blue-100 text-blue-700 rounded-full px-4 py-2 text-sm font-semibold">
																	<span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
																	Returned
																</span>
															)}
															{order.status === "Replaced" && (
																<span className="inline-flex items-center bg-green-100 text-green-700 rounded-full px-4 py-2 text-sm font-semibold">
																	<span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
																	Replaced
																</span>
															)}
														</div>
														<img
															src={order.items?.[0]?.image || "/brands/logo.png"}
															alt={order.items?.[0]?.name}
															className="w-32 h-32 object-cover rounded-xl border shadow-md"
															onError={e => { (e.currentTarget as HTMLImageElement).src = "/brands/logo.png"; }}
														/>
													</div>

													{/* Order Details Column */}
													<div className="flex-1 flex flex-col gap-4">
														<div className="flex flex-col gap-2">
															{/* Order Title and ID */}
															<div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
																<h3 className="text-xl font-bold text-gray-900">{order.items?.[0]?.name}</h3>
																<div className="text-sm bg-gray-100 px-3 py-1 rounded-full font-mono">
																	Order ID: {order.id.slice(-6).toUpperCase()}
																</div>
															</div>

															{/* Product Description */}
															<p className="text-gray-600 text-base">
																{order.items?.[0]?.description}
															</p>

															{/* Order Meta Info */}
															<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
																<div className="flex items-center gap-2 text-gray-600">
																	<FiPackage className="w-5 h-5" />
																	<span>Qty: {order.items?.[0]?.quantity}</span>
																</div>
																<div className="flex items-center gap-2 text-gray-600">
																	<FiTruck className="w-5 h-5" />
																	<span>Ship to: {order.address?.address || order.shipTo}</span>
																</div>
																<div className="flex items-center gap-2 text-gray-600">
																	<FiCalendar className="w-5 h-5" />
																	<span>Placed on: {order.id.substring(0,8)}</span>
																</div>
																<div className="flex items-center gap-2 text-gray-600">
																	<FiMapPin className="w-5 h-5" />
																	<span>Total: <span className="font-bold text-[#6B46C1]">Rs. {order.total}</span></span>
																</div>
															</div>

															{/* Reason if exists */}
															{order.reason && (
																<div className="mt-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
																	<span className="font-semibold">Reason:</span> {order.reason}
																</div>
															)}
														</div>

														{/* Action Buttons */}
														<div className="flex flex-wrap gap-3 mt-auto pt-4 border-t">
															<button
																className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition flex items-center justify-center gap-2"
																onClick={() => generateInvoicePDF(order)}
															>
																<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-13" />
																</svg>
																Download Invoice (PDF)
															</button>

															{order.status === "Pending" && (
																<>
																	<button
																		className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition flex items-center justify-center gap-2"
																		onClick={() => {
																			setActionOrderId(order.id);
																			setActionType("cancel");
																		}}
																	>
																		Request Cancellation
																	</button>
																	<button
																		className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition flex items-center justify-center gap-2"
																		onClick={() => {
																			setActionOrderId(order.id);
																			setActionType("return");
																		}}
																	>
																		Return
																	</button>
																	<button
																		className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition flex items-center justify-center gap-2"
																		onClick={() => {
																			setActionOrderId(order.id);
																			setActionType("replace");
																		}}
																	>
																		Replace
																	</button>
																</>
															)}
														</div>
													</div>
												</div>
											</motion.div>
										))}
									</div>
								)}
								{actionOrderId && actionType && (
									<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
										<motion.div
											initial={{ scale: 0.8, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg"
										>
											<h3 className="text-2xl font-extrabold mb-6 text-center">
												{actionType === "cancel" && "Request Order Cancellation"}
												{actionType === "return" && "Request Order Return"}
												{actionType === "replace" && "Request Order Replacement"}
											</h3>
											<div className="mb-6">
												<label className="block text-lg font-semibold mb-2">Please provide a reason:</label>
												<textarea
													value={reason}
													onChange={e => setReason(e.target.value)}
													className="w-full px-4 py-3 rounded-xl border min-h-[100px] text-base"
													placeholder="Describe your reason for this request..."
												/>
											</div>
											<div className="flex gap-6 mt-8">
												<button
													className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition text-lg"
													onClick={() => {
														setActionOrderId(null);
														setActionType(null);
														setReason("");
													}}
													disabled={submitting}
												>
													Cancel
												</button>
												<button
													className={`flex-1 px-4 py-3 rounded-xl bg-pink-500 text-white font-bold hover:bg-pink-600 transition text-lg ${
														submitting ? "opacity-50" : ""
													}`}
													onClick={handleOrderAction}
													disabled={submitting || !reason.trim()}
												>
													{submitting ? "Submitting..." : "Submit Request"}
												</button>
											</div>
										</motion.div>
									</div>
								)}
							</>
						)}
					</section>
				</main>
		);
}


