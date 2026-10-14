import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Modal from '../../components/common/Modal';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  ShoppingBag,
  PlusCircle,
  Search,
  Calendar,
  IndianRupee,
  FileCheck
} from 'lucide-react';

export default function EmployeeOrdersPage() {
  const { currentUser } = useAuth();
  const { orders, addOrder } = useData();

  const currentEmpId = currentUser?.id || 'EMP101';
  const personalOrders = orders.filter((o) => o.employeeId === currentEmpId);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    productName: '',
    orderAmount: '',
    orderDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const uniqueDates = Array.from(new Set(personalOrders.map((o) => o.orderDate))).sort().reverse();

  const filteredOrders = personalOrders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = selectedDate === 'All' ? true : o.orderDate === selectedDate;
    return matchesSearch && matchesDate;
  });

  const totalAmount = filteredOrders.reduce((sum, o) => sum + (Number(o.orderAmount) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.customerName.trim()) errs.customerName = 'Customer / Shop name is required';
    if (!formData.productName.trim()) errs.productName = 'Product name is required';
    if (!formData.orderAmount || Number(formData.orderAmount) <= 0) errs.orderAmount = 'Valid order amount is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    addOrder({
      ...formData,
      employeeId: currentEmpId,
      employeeName: currentUser?.name || 'Rahul Verma'
    });

    setIsModalOpen(false);
    setFormData({
      customerName: '',
      productName: '',
      orderAmount: '',
      orderDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#102B5C] tracking-tight">
            My Booked Orders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personal sales records and customer orders received during field visits.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              customerName: '',
              productName: '',
              orderAmount: '',
              orderDate: new Date().toISOString().split('T')[0],
              notes: ''
            });
            setErrors({});
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#102B5C] to-[#2456D6] hover:from-[#0C224B] hover:to-blue-700 shadow-md shadow-blue-900/15 transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record New Order</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase font-bold text-slate-400">Total Orders (Filtered)</p>
            <p className="text-2xl font-black text-[#102B5C] mt-1">{filteredOrders.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-[#2456D6]">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase font-bold text-slate-400">Total Sales Value</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{formatINR(totalAmount)}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer, product, order ID..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#2456D6] bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Order Dates</option>
            {uniqueDates.map((d) => (
              <option key={d} value={d}>
                {formatDate(d)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer / Shop Name</th>
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">Visit Ref</th>
                <th className="py-3.5 px-5 text-right">Order Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    No orders booked matching this filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-mono font-bold text-slate-900">{o.id}</div>
                      <div className="text-[11px] text-slate-400">{formatDate(o.orderDate)}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{o.customerName}</div>
                      {o.notes && <div className="text-[10px] text-slate-500 italic">{o.notes}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{o.productName}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {o.visitId || '—'}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="font-mono font-black text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 inline-block">
                        {formatINR(o.orderAmount)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Order Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record New Customer Order">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Customer / Shop Name *</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="e.g. Mahavir Cable Corporation"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2456D6]"
            />
            {errors.customerName && <p className="text-rose-600 text-[11px] mt-1">{errors.customerName}</p>}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Product Name & Specifications *</label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              placeholder="e.g. FR Copper Wire Spool 2.5 sq mm"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2456D6]"
            />
            {errors.productName && <p className="text-rose-600 text-[11px] mt-1">{errors.productName}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Order Amount (₹ INR) *</label>
              <input
                type="number"
                value={formData.orderAmount}
                onChange={(e) => setFormData({ ...formData, orderAmount: e.target.value })}
                placeholder="e.g. 84500"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2456D6]"
              />
              {errors.orderAmount && <p className="text-rose-600 text-[11px] mt-1">{errors.orderAmount}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Order Date *</label>
              <input
                type="date"
                value={formData.orderDate}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2456D6]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Order Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Special delivery instructions or advance details..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2456D6]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-bold text-white bg-[#102B5C] hover:bg-blue-900 shadow-xs"
            >
              Save Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
