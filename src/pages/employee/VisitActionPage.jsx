import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getCurrentBrowserLocation, getSimulatedDemoLocation } from '../../services/locationService';
import { formatINR, formatCoordinates, getGoogleMapsUrl } from '../../utils/formatters';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  MapPin,
  Clock,
  Compass,
  AlertTriangle,
  CheckCircle2,
  PlayCircle,
  StopCircle,
  ExternalLink,
  ShoppingBag,
  IndianRupee,
  FileText,
  User,
  Building,
  RefreshCw,
  Phone,
  MessageSquare
} from 'lucide-react';

export default function VisitActionPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { startVisit, endVisit, getActiveVisitForEmployee, showToast } = useData();

  const currentEmpId = currentUser?.id || 'EMP101';
  const activeVisit = getActiveVisitForEmployee(currentEmpId);

  // START VISIT FORM STATE
  const [formData, setFormData] = useState({
    customerName: '',
    personMet: '',
    contactNumber: '',
    remarks: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // GPS CAPTURE STATE FOR START VISIT
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [capturedLocation, setCapturedLocation] = useState(null);
  const [gpsError, setGpsError] = useState(null);

  // END VISIT MODAL & ORDER ATTACHMENT STATE
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [endRemarks, setEndRemarks] = useState('');
  const [isEndingGpsLoading, setIsEndingGpsLoading] = useState(false);
  const [endCapturedLocation, setEndCapturedLocation] = useState(null);
  const [attachOrder, setAttachOrder] = useState(false);
  const [orderData, setOrderData] = useState({
    productName: '',
    orderAmount: '',
    notes: ''
  });
  const [orderErrors, setOrderErrors] = useState({});

  // SUCCESS COMPLETION RECEIPT MODAL
  const [completedSummary, setCompletedSummary] = useState(null);

  // Live elapsed time timer for active visit
  const [elapsedString, setElapsedString] = useState('00:00:00');

  useEffect(() => {
    if (!activeVisit) return;

    const interval = setInterval(() => {
      try {
        const [time, modifier] = activeVisit.startTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const startD = new Date();
        startD.setHours(hours, minutes, 0, 0);

        const diffSecs = Math.max(0, Math.floor((new Date() - startD) / 1000));
        const hrs = Math.floor(diffSecs / 3600);
        const mins = Math.floor((diffSecs % 3600) / 60);
        const secs = diffSecs % 60;

        setElapsedString(
          `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        );
      } catch {
        setElapsedString('In Progress');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeVisit]);

  // Request browser GPS on component mount if no active visit
  useEffect(() => {
    if (!activeVisit && !capturedLocation) {
      handleRequestBrowserGps();
    }
  }, [activeVisit]);

  const handleRequestBrowserGps = async () => {
    setIsCapturingGps(true);
    setGpsError(null);

    const result = await getCurrentBrowserLocation();
    setIsCapturingGps(false);

    if (result.success) {
      setCapturedLocation(result);
      showToast('Browser GPS coordinates captured successfully!', 'success');
    } else {
      setGpsError(result.error);
    }
  };

  const handleUseSimulatedLocation = () => {
    const demoLoc = getSimulatedDemoLocation('Raipur Central Market');
    setCapturedLocation(demoLoc);
    setGpsError(null);
    showToast('Loaded Sample Demo Coordinates (Raipur, C.G.)', 'info');
  };

  const handleStartVisitSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.customerName.trim()) errors.customerName = 'Customer / Shop name is required';
    if (!formData.personMet.trim()) errors.personMet = 'Person met name is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!capturedLocation) {
      showToast('Please capture GPS coordinates or select Demo Location first.', 'warning');
      return;
    }

    const res = startVisit({
      employeeId: currentEmpId,
      employeeName: currentUser?.name || 'Rahul Verma',
      customerName: formData.customerName,
      personMet: formData.personMet,
      contactNumber: formData.contactNumber,
      remarks: formData.remarks,
      checkInLocation: capturedLocation
    });

    if (res.success) {
      setFormData({
        customerName: '',
        personMet: '',
        contactNumber: '',
        remarks: ''
      });
      setCapturedLocation(null);
      setGpsError(null);
    }
  };

  // Open End Visit Modal & Attempt Check-out GPS
  const handleOpenEndModal = async () => {
    setIsEndModalOpen(true);
    setEndRemarks('');
    setAttachOrder(false);
    setOrderData({ productName: '', orderAmount: '', notes: '' });
    setOrderErrors({});

    // Attempt browser checkout GPS
    setIsEndingGpsLoading(true);
    const result = await getCurrentBrowserLocation();
    setIsEndingGpsLoading(false);

    if (result.success) {
      setEndCapturedLocation(result);
    } else {
      // Fallback to simulated demo coords
      setEndCapturedLocation(getSimulatedDemoLocation('Raipur Check-out Point'));
    }
  };

  const handleConfirmEndVisit = (e) => {
    e.preventDefault();

    if (attachOrder) {
      const errs = {};
      if (!orderData.productName.trim()) errs.productName = 'Product name is required';
      if (!orderData.orderAmount || Number(orderData.orderAmount) <= 0) {
        errs.orderAmount = 'Valid order amount is required';
      }
      if (Object.keys(errs).length > 0) {
        setOrderErrors(errs);
        return;
      }
    }

    const res = endVisit({
      visitId: activeVisit.id,
      checkOutLocation: endCapturedLocation,
      finalRemarks: endRemarks,
      newOrderData: attachOrder ? {
        customerName: activeVisit.customerName,
        productName: orderData.productName,
        orderAmount: orderData.orderAmount,
        notes: orderData.notes
      } : null
    });

    if (res.success) {
      setIsEndModalOpen(false);
      setCompletedSummary({
        customerName: activeVisit.customerName,
        personMet: activeVisit.personMet,
        startTime: activeVisit.startTime,
        endTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        orderAttached: attachOrder,
        orderAmount: attachOrder ? orderData.orderAmount : 0,
        productName: attachOrder ? orderData.productName : ''
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-[#2456D6]" />
            <span className="text-xs font-bold text-[#2456D6] uppercase tracking-wider">
              Quotation Module 3
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#102B5C] tracking-tight">
            Field Visit Operations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Capture check-in GPS, meet customer, record feedback, and optionally record on-site orders.
          </p>
        </div>

        <div>
          <Badge
            status={activeVisit ? 'Visit Running' : 'Ready to Start'}
            variant={activeVisit ? 'warning' : 'success'}
          />
        </div>
      </div>

      {/* VIEW A: IF A VISIT IS CURRENTLY RUNNING */}
      {activeVisit ? (
        <div className="space-y-6">
          {/* Active Running Card */}
          <div className="bg-white rounded-3xl border-2 border-amber-400 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-bl-full pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-ping" />
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Active Field Visit In Progress
                  </span>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">ID: {activeVisit.id}</p>
                </div>
              </div>

              {/* Running Digital Stop Watch */}
              <div className="bg-slate-900 text-amber-400 px-4 py-2 rounded-2xl font-mono font-black text-xl sm:text-2xl tracking-widest shadow-inner flex items-center gap-2 self-start sm:self-auto">
                <Clock className="w-5 h-5 text-amber-400 animate-spin-slow" />
                <span>{elapsedString}</span>
              </div>
            </div>

            {/* Visit Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Customer / Shop Name</label>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5">{activeVisit.customerName}</h3>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Person Met & Contact</label>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{activeVisit.personMet}</p>
                  {activeVisit.contactNumber && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" /> {activeVisit.contactNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Purpose / Initial Remarks</label>
                  <p className="text-xs text-slate-700 mt-0.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    {activeVisit.remarks || 'Routine visit'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Start Time Logged</label>
                  <p className="text-base font-extrabold text-[#102B5C] mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#2456D6]" /> {activeVisit.date} at {activeVisit.startTime}
                  </p>
                </div>

                {/* Check-in GPS info */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Check-In GPS Coordinates</label>
                    <Badge
                      status={activeVisit.checkInLocation?.isSimulated ? 'Sample Demo GPS' : 'Browser GPS'}
                      variant={activeVisit.checkInLocation?.isSimulated ? 'demo' : 'gps'}
                    />
                  </div>

                  {activeVisit.checkInLocation ? (
                    <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/60 space-y-2">
                      <p className="font-mono text-xs font-bold text-slate-800">
                        {activeVisit.checkInLocation.latitude.toFixed(6)}, {activeVisit.checkInLocation.longitude.toFixed(6)}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Accuracy: ±{activeVisit.checkInLocation.accuracy}m</span>
                        <a
                          href={getGoogleMapsUrl(activeVisit.checkInLocation.latitude, activeVisit.checkInLocation.longitude)}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#2456D6] hover:underline flex items-center gap-1"
                        >
                          View on Google Maps <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Location not captured.</p>
                  )}
                </div>
              </div>
            </div>

            {/* End Visit CTA Button */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                Ready to leave? Click below to capture check-out GPS and record final notes or an order.
              </p>
              <button
                type="button"
                onClick={handleOpenEndModal}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <StopCircle className="w-5 h-5" />
                <span>Complete & End Visit</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW B: START VISIT WORKFLOW */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-[#102B5C] flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-[#2456D6]" />
              Start New Client Visit
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow the quotation workflow: Automatic GPS check-in → Enter customer details → Start.
            </p>
          </div>

          {/* STEP 1: GPS ACQUISITION CARD */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#2456D6]" />
                  Step 1: Check-in Location Capture (GPS)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Captures latitude and longitude per quotation terms.
                </p>
              </div>

              {capturedLocation && (
                <Badge
                  status={capturedLocation.isSimulated ? 'Sample Demo Location' : 'Genuine Browser GPS'}
                  variant={capturedLocation.isSimulated ? 'demo' : 'gps'}
                />
              )}
            </div>

            {/* GPS Status Box */}
            {isCapturingGps ? (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3 text-xs text-blue-900">
                <RefreshCw className="w-4 h-4 text-[#2456D6] animate-spin shrink-0" />
                <span>Requesting browser geolocation permission and acquiring current GPS satellite fix...</span>
              </div>
            ) : capturedLocation ? (
              <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    GPS Coordinates Locked:
                  </span>
                  <button
                    type="button"
                    onClick={handleRequestBrowserGps}
                    className="text-[11px] text-[#2456D6] hover:underline font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Re-check
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-800 font-bold bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {formatCoordinates(capturedLocation.latitude, capturedLocation.longitude)}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Accuracy: ±{capturedLocation.accuracy}m</span>
                  <a
                    href={getGoogleMapsUrl(capturedLocation.latitude, capturedLocation.longitude)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#2456D6] hover:underline flex items-center gap-1"
                  >
                    Preview in Google Maps <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">GPS Permission Needed or Unavailable</p>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                      {gpsError || 'Browser location permission was not granted or device GPS is unavailable.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRequestBrowserGps}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                  >
                    <Compass className="w-3.5 h-3.5" /> Try Browser GPS Again
                  </button>
                  <button
                    type="button"
                    onClick={handleUseSimulatedLocation}
                    className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100/60 text-amber-900 font-bold text-xs shadow-2xs"
                  >
                    Use Sample Raipur Demo GPS (Testing)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: CUSTOMER / SHOP DETAILS FORM */}
          <form onSubmit={handleStartVisitSubmit} className="space-y-4 text-xs">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-[#2456D6]" />
              Step 2: Customer / Shop Interaction Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer / Shop Name *</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Shree Balaji Hardware & Electricals"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50"
                />
                {formErrors.customerName && (
                  <p className="text-rose-600 text-[11px] mt-1">{formErrors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Person Met / Owner Name *</label>
                <input
                  type="text"
                  value={formData.personMet}
                  onChange={(e) => setFormData({ ...formData, personMet: e.target.value })}
                  placeholder="e.g. Mr. Rajesh Agarwal (Proprietor)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50"
                />
                {formErrors.personMet && (
                  <p className="text-rose-600 text-[11px] mt-1">{formErrors.personMet}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Phone (Optional)</label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="+91 98271 XXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Visit Purpose / Initial Remarks</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="e.g. New catalog presentation, Diwali stock booking..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={!capturedLocation}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#102B5C] to-[#2456D6] hover:from-[#0C224B] hover:to-blue-700 shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Start Visit (Log Check-In GPS)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* END VISIT MODAL WORKFLOW */}
      <Modal isOpen={isEndModalOpen} onClose={() => setIsEndModalOpen(false)} title="Complete & End Field Visit" maxWidth="max-w-xl">
        <form onSubmit={handleConfirmEndVisit} className="space-y-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="font-extrabold text-slate-900 text-sm">{activeVisit?.customerName}</h4>
            <p className="text-slate-500 text-xs mt-0.5">Person Met: {activeVisit?.personMet}</p>
          </div>

          {/* Checkout GPS */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Check-Out GPS Verification
              </span>
              {endCapturedLocation && (
                <Badge
                  status={endCapturedLocation.isSimulated ? 'Sample Demo GPS' : 'Browser GPS'}
                  variant={endCapturedLocation.isSimulated ? 'demo' : 'gps'}
                />
              )}
            </div>

            {isEndingGpsLoading ? (
              <p className="text-slate-500 italic">Acquiring checkout GPS position...</p>
            ) : endCapturedLocation ? (
              <div className="font-mono text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {endCapturedLocation.latitude.toFixed(6)}, {endCapturedLocation.longitude.toFixed(6)}
              </div>
            ) : (
              <p className="text-rose-600">Location could not be captured.</p>
            )}
          </div>

          {/* Final Feedback / Remarks */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Final Visit Feedback & Customer Remarks *
            </label>
            <textarea
              rows={2}
              value={endRemarks}
              onChange={(e) => setEndRemarks(e.target.value)}
              placeholder="e.g. Client agreed on pricing. Follow-up next Tuesday. High interest in wiring sets."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2456D6]"
            />
          </div>

          {/* Toggle: Add Customer Order (Quotation Module 4) */}
          <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={attachOrder}
                onChange={(e) => setAttachOrder(e.target.checked)}
                className="w-4 h-4 rounded text-[#2456D6] focus:ring-blue-500 border-slate-300"
              />
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#2456D6]" />
                Did you receive/book an order during this visit?
              </span>
            </label>

            {attachOrder && (
              <div className="space-y-3 pt-2 border-t border-blue-200/60">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Name & Quantity *</label>
                  <input
                    type="text"
                    value={orderData.productName}
                    onChange={(e) => setOrderData({ ...orderData, productName: e.target.value })}
                    placeholder="e.g. Copper Wire Spool 2.5mm (50 Bundles)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#2456D6]"
                  />
                  {orderErrors.productName && (
                    <p className="text-rose-600 text-[11px] mt-1">{orderErrors.productName}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Order Amount (₹ INR) *</label>
                  <input
                    type="number"
                    value={orderData.orderAmount}
                    onChange={(e) => setOrderData({ ...orderData, orderAmount: e.target.value })}
                    placeholder="e.g. 84500"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#2456D6]"
                  />
                  {orderErrors.orderAmount && (
                    <p className="text-rose-600 text-[11px] mt-1">{orderErrors.orderAmount}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Order Delivery Notes</label>
                  <input
                    type="text"
                    value={orderData.notes}
                    onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                    placeholder="e.g. Delivery within 48h requested."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#2456D6]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsEndModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20"
            >
              Confirm & Save Completed Visit
            </button>
          </div>
        </form>
      </Modal>

      {/* SUCCESS SUMMARY RECEIPT MODAL */}
      <Modal
        isOpen={!!completedSummary}
        onClose={() => setCompletedSummary(null)}
        title="Visit Completed Successfully!"
        maxWidth="max-w-md"
      >
        {completedSummary && (
          <div className="space-y-4 text-xs text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">{completedSummary.customerName}</h3>
              <p className="text-slate-500 mt-0.5">Person Met: {completedSummary.personMet}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Check-In:</span>
                <span className="font-bold text-slate-800">{completedSummary.startTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Check-Out:</span>
                <span className="font-bold text-slate-800">{completedSummary.endTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-700">Completed & Verified</span>
              </div>
              {completedSummary.orderAttached && (
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm">
                  <span className="text-slate-700">Order Booked:</span>
                  <span className="text-emerald-700 font-mono font-black">
                    {formatINR(completedSummary.orderAmount)}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setCompletedSummary(null);
                navigate('/employee/dashboard');
              }}
              className="w-full py-3 rounded-xl font-bold text-white bg-[#102B5C] hover:bg-blue-900 shadow-md"
            >
              Return to My Dashboard
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
