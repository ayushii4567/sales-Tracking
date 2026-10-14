import React from 'react';
import Modal from './Modal';
import { QUOTATION_INFO } from '../../data/seedData';
import { FileText, CheckCircle2, XCircle, Building2, Phone, Mail, Globe, MapPin } from 'lucide-react';

export default function QuotationModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project Quotation & Scope Reference" maxWidth="max-w-3xl">
      <div className="space-y-6 text-slate-700 text-sm">
        {/* Header Header */}
        <div className="bg-gradient-to-r from-[#102B5C] to-[#2456D6] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center font-black text-xl text-[#4F8CFF] border border-white/20">
              INS
            </div>
            <div>
              <h4 className="font-extrabold text-base tracking-wide">
                {QUOTATION_INFO.company}
              </h4>
              <p className="text-xs text-blue-200">
                {QUOTATION_INFO.tagline} • "{QUOTATION_INFO.motto}"
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right bg-white/10 px-3 py-2 rounded-xl text-xs backdrop-blur-xs border border-white/10">
            <p className="font-mono font-semibold text-white">Ref: {QUOTATION_INFO.refNo}</p>
            <p className="text-blue-200">Date: {QUOTATION_INFO.date}</p>
          </div>
        </div>

        {/* Modules Table from Quotation */}
        <div>
          <h5 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#2456D6]" />
            Quoted Modules & Specifications
          </h5>
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 text-left w-12">S.No</th>
                  <th className="py-2.5 px-3 text-left w-48">Module / Page</th>
                  <th className="py-2.5 px-3 text-left">Key Features / Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2 px-3 font-semibold text-slate-500">1</td>
                  <td className="py-2 px-3 font-medium text-slate-900">Admin Dashboard</td>
                  <td className="py-2 px-3 text-slate-600">Total Employees, Total Visits, Total Orders, Total Order Amount, Date-wise Summary, Employee-wise Performance</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2 px-3 font-semibold text-slate-500">2</td>
                  <td className="py-2 px-3 font-medium text-slate-900">Sales Employee Management</td>
                  <td className="py-2 px-3 text-slate-600">Employee Name, Employee ID, Mobile Number, Login Credentials, Account Status</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2 px-3 font-semibold text-slate-500">3</td>
                  <td className="py-2 px-3 font-medium text-slate-900">Visit Tracking</td>
                  <td className="py-2 px-3 text-slate-600">Start Visit, Automatic Date & Time, GPS Location Capture, Customer/Shop Name, Person Met, Feedback/Remarks, End Visit</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2 px-3 font-semibold text-slate-500">4</td>
                  <td className="py-2 px-3 font-medium text-slate-900">Order Management</td>
                  <td className="py-2 px-3 text-slate-600">Customer/Shop Name, Product Name, Order Amount, Order Date</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2 px-3 font-semibold text-slate-500">5</td>
                  <td className="py-2 px-3 font-medium text-slate-900">Sales Dashboard & History</td>
                  <td className="py-2 px-3 text-slate-600">Today's Visits, Total Orders, Total Order Amount, Previous Visits, Date-wise Summary</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Scope Note from Page 3 of Quotation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <h6 className="font-bold text-emerald-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              In-Scope Functionalities
            </h6>
            <ul className="text-xs space-y-1 text-slate-700">
              {QUOTATION_INFO.scope.included.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
            <h6 className="font-bold text-rose-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <XCircle className="w-4 h-4 text-rose-600" />
              Excluded per Quotation Note
            </h6>
            <ul className="text-xs space-y-1 text-slate-700">
              {QUOTATION_INFO.scope.excluded.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact info footer */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#2456D6]" />
            <span>{QUOTATION_INFO.address}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" /> {QUOTATION_INFO.phone}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#2456D6]" /> {QUOTATION_INFO.email}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
