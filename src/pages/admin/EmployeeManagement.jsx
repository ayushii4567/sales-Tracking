import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/common/Modal';
import Drawer from '../../components/common/Drawer';
import Badge from '../../components/common/Badge';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  UserPlus,
  Search,
  Filter,
  Edit2,
  Eye,
  Power,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Key,
  Copy,
  CheckCircle2,
  TrendingUp,
  ShoppingBag,
  FolderOpen,
  UploadCloud,
  Trash2
} from 'lucide-react';

export default function EmployeeManagement() {
  const { employees, addEmployee, updateEmployee, toggleEmployeeStatus, visits, orders, showToast } = useData();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Drawers state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    territory: 'Raipur Central Market',
    status: 'Active'
  });
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result;
      if (dataUrl) {
        setFormData((prev) => ({ ...prev, avatar: dataUrl }));
        showToast(`Photo "${file.name}" selected from folder!`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.territory.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ? true : emp.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Employee name is required';
    if (!formData.phone.trim()) errors.phone = 'Mobile number is required';
    if (!formData.email.trim()) errors.email = 'Email address is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      territory: 'Raipur Central & Pandri',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      status: 'Active'
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setSelectedEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      territory: emp.territory,
      avatar: emp.avatar,
      status: emp.status
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleOpenDrawer = (emp) => {
    setSelectedEmployee(emp);
    setIsDrawerOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    addEmployee(formData);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    updateEmployee(selectedEmployee.id, formData);
    setIsEditModalOpen(false);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard?.writeText(text);
    showToast(`Copied ${label} to clipboard!`, 'info');
  };

  // Selected employee stats for drawer
  const empVisits = selectedEmployee ? visits.filter((v) => v.employeeId === selectedEmployee.id) : [];
  const empOrders = selectedEmployee ? orders.filter((o) => o.employeeId === selectedEmployee.id) : [];
  const empTotalRevenue = empOrders.reduce((sum, o) => sum + Number(o.orderAmount), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-[#102B5C] tracking-tight">
            Sales Employee Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain employee records, territories, login credentials, and account activation status.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#102B5C] to-[#2456D6] hover:from-[#0C224B] hover:to-blue-700 shadow-md shadow-blue-900/15 transition-all self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, or territory..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#2456D6] bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">Status:</span>
          </div>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['All', 'Active', 'Inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  statusFilter === status
                    ? 'bg-white text-[#102B5C] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Employees Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Employee Info</th>
                <th className="py-3.5 px-4">Employee ID</th>
                <th className="py-3.5 px-4">Mobile Number</th>
                <th className="py-3.5 px-4">Territory / Area</th>
                <th className="py-3.5 px-4">Demo Credentials</th>
                <th className="py-3.5 px-4 text-center">Account Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No employees matching the current filter.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Employee info */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{emp.name}</div>
                          <div className="text-[11px] text-slate-500">{emp.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {emp.id}
                      </span>
                    </td>

                    {/* Mobile */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{emp.phone}</td>

                    {/* Territory */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{emp.territory}</td>

                    {/* Login credentials (safe representation) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Key className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-mono text-slate-500">ID: {emp.id}</span>
                        <button
                          onClick={() => copyToClipboard(emp.id, 'Employee ID')}
                          className="p-1 hover:bg-slate-200/60 rounded text-slate-400 hover:text-slate-700"
                          title="Copy ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400">Default: Sales@123</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <Badge status={emp.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <button
                          onClick={() => handleOpenDrawer(emp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#2456D6] hover:bg-blue-50 transition-colors"
                          title="View Employee Profile & Stats"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Status Toggle */}
                        <button
                          onClick={() => toggleEmployeeStatus(emp.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            emp.status === 'Active'
                              ? 'text-rose-500 hover:bg-rose-50 hover:text-rose-700'
                              : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                          title={emp.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register Sales Employee">
        <form onSubmit={handleSaveAdd} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Agrawal"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2456D6]"
            />
            {formErrors.name && <p className="text-rose-600 text-[11px] mt-1">{formErrors.name}</p>}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. ramesh.a@inextsoftware.in"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2456D6]"
            />
            {formErrors.email && <p className="text-rose-600 text-[11px] mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98270 XXXXX"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2456D6]"
            />
            {formErrors.phone && <p className="text-rose-600 text-[11px] mt-1">{formErrors.phone}</p>}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Assigned Territory / Hub</label>
            <input
              type="text"
              value={formData.territory}
              onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
              placeholder="e.g. Raipur Central Market, Pandri"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2456D6]"
            />
          </div>

          {/* Photo upload from folder */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Employee Photo (From Folder)</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                alt=""
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20"
              />
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2456D6] hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Choose Photo from Folder</span>
                </button>
                <p className="text-[10px] text-slate-500 mt-1">Select JPG, PNG or WEBP from computer</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 space-y-1">
            <p className="font-bold text-blue-900 text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2456D6]" /> Auto-Generated Login Credentials
            </p>
            <p className="text-slate-600 text-[11px]">
              Employee ID will be auto-generated (e.g. EMP109). Default demo password: <code>Sales@123</code>.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-bold text-white bg-[#102B5C] hover:bg-blue-900 shadow-xs cursor-pointer"
            >
              Save Employee
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Employee Details">
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          {/* Photo upload from folder */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Employee Photo (From Folder)</label>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                alt=""
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20"
              />
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2456D6] hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Change Photo from Folder</span>
                </button>
                <p className="text-[10px] text-slate-500 mt-1">Select JPG, PNG or WEBP from computer</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2456D6]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2456D6]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2456D6]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Territory</label>
            <input
              type="text"
              value={formData.territory}
              onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2456D6]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-bold text-white bg-[#102B5C] hover:bg-blue-900 shadow-xs cursor-pointer"
            >
              Update Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Employee Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Employee Performance & Profile"
      >
        {selectedEmployee && (
          <div className="space-y-6 text-xs">
            {/* Header profile card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={selectedEmployee.avatar}
                alt={selectedEmployee.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#2456D6]/30 shadow-sm"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-extrabold text-slate-900">
                    {selectedEmployee.name}
                  </h4>
                  <Badge status={selectedEmployee.status} />
                </div>
                <p className="font-mono text-slate-500 font-semibold">
                  ID: {selectedEmployee.id}
                </p>
                <p className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedEmployee.territory}
                </p>
              </div>
            </div>

            {/* Quick KPI stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                <p className="text-[10px] uppercase font-bold text-slate-500">Total Visits</p>
                <p className="text-xl font-extrabold text-[#102B5C] mt-1">{empVisits.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <p className="text-[10px] uppercase font-bold text-slate-500">Orders Booked</p>
                <p className="text-xl font-extrabold text-emerald-700 mt-1">{empOrders.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <p className="text-[10px] uppercase font-bold text-slate-500">Total Revenue</p>
                <p className="text-base font-extrabold text-indigo-900 mt-1">{formatINR(empTotalRevenue)}</p>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Contact & Identity
              </h5>
              <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
                  </span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
                  </span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Joined Date
                  </span>
                  <span className="font-semibold text-slate-800">{formatDate(selectedEmployee.joinDate)}</span>
                </div>
              </div>
            </div>

            {/* Recent Visits by this employee */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center justify-between">
                <span>Recent Field Visits ({empVisits.length})</span>
              </h5>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {empVisits.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No visits logged yet.</p>
                ) : (
                  empVisits.slice(0, 5).map((v) => (
                    <div key={v.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{v.customerName}</p>
                        <p className="text-[10px] text-slate-500">{formatDate(v.date)} • {v.startTime}</p>
                      </div>
                      <Badge status={v.status} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Orders by this employee */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Orders Booked ({empOrders.length})
              </h5>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {empOrders.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No orders logged yet.</p>
                ) : (
                  empOrders.slice(0, 5).map((o) => (
                    <div key={o.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{o.customerName}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{o.productName}</p>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {formatINR(o.orderAmount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
