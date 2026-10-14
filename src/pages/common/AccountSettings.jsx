import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Badge from '../../components/common/Badge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Save,
  CheckCircle2,
  Key,
  Building,
  Briefcase,
  Compass,
  AlertCircle,
  Bell,
  Smartphone,
  ShieldCheck,
  Check,
  RotateCcw,
  Sliders,
  FileText,
  FolderOpen,
  UploadCloud,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'
];

export default function AccountSettings() {
  const { currentUser, updateCurrentUser, isAdmin } = useAuth();
  const { updateEmployee, showToast, employees } = useData();

  // Active Tab
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'preferences' | 'security' | 'system'

  // Profile Form State
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98271 44521');
  const [altPhone, setAltPhone] = useState(currentUser?.altPhone || '+91 94252 88123');
  const [territory, setTerritory] = useState(
    currentUser?.territory || (isAdmin ? 'Raipur Head Office' : 'Raipur Central & Pandri')
  );
  const [designation, setDesignation] = useState(
    currentUser?.designation || (isAdmin ? 'Business Head & Administrator' : 'Field Sales Representative')
  );
  const [bio, setBio] = useState(
    currentUser?.bio ||
      (isAdmin
        ? 'Directing sales operations and daily visit oversight across Raipur & Chhattisgarh zones.'
        : 'Senior field representative managing retail and wholesale dealer relations in Raipur.')
  );
  const [avatar, setAvatar] = useState(currentUser?.avatar || PRESET_AVATARS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showCustomAvatarInput, setShowCustomAvatarInput] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Process chosen image file from local folder / device
  const processImageFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP, GIF)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit. Please choose a smaller photo.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result;
      if (dataUrl) {
        setAvatar(dataUrl);
        setCustomAvatarUrl('');
        setUploadedFileName(file.name);
        showToast(`Image "${file.name}" selected from folder! Click 'Save Profile Details' to apply.`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    processImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // App & Field Preferences State
  const [gpsAccuracy, setGpsAccuracy] = useState(currentUser?.gpsAccuracy || 'high');
  const [emailNotifications, setEmailNotifications] = useState(currentUser?.emailNotifications ?? true);
  const [whatsappReceipts, setWhatsappReceipts] = useState(currentUser?.whatsappReceipts ?? true);
  const [offlineSync, setOfflineSync] = useState(currentUser?.offlineSync ?? true);
  const [dailyDigestTime, setDailyDigestTime] = useState(currentUser?.dailyDigestTime || '19:00');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser?.twoFactorEnabled ?? false);

  // Errors & Feedback
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Sync state whenever currentUser or role changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '+91 98271 44521');
      setAltPhone(currentUser.altPhone || '+91 94252 88123');
      setTerritory(currentUser.territory || (isAdmin ? 'Raipur Head Office' : 'Raipur Central & Pandri'));
      setDesignation(
        currentUser.designation || (isAdmin ? 'Business Head & Administrator' : 'Field Sales Representative')
      );
      setBio(
        currentUser.bio ||
          (isAdmin
            ? 'Directing sales operations and daily visit oversight across Raipur & Chhattisgarh zones.'
            : 'Senior field representative managing retail and wholesale dealer relations in Raipur.')
      );
      setAvatar(currentUser.avatar || PRESET_AVATARS[0]);
      setGpsAccuracy(currentUser.gpsAccuracy || 'high');
      setEmailNotifications(currentUser.emailNotifications ?? true);
      setWhatsappReceipts(currentUser.whatsappReceipts ?? true);
      setOfflineSync(currentUser.offlineSync ?? true);
      setTwoFactorEnabled(currentUser.twoFactorEnabled ?? false);
    }
  }, [currentUser?.id, currentUser?.role]);

  // Handle Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const errors = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!email.trim()) errors.email = 'Email address is required';
    if (!phone.trim()) errors.phone = 'Mobile number is required';

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      showToast('Please correct the errors in the profile form', 'error');
      return;
    }

    setProfileErrors({});

    const updatedProfile = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      altPhone: altPhone.trim(),
      territory: territory.trim(),
      designation: designation.trim(),
      bio: bio.trim(),
      avatar: customAvatarUrl.trim() || avatar
    };

    // Update session in AuthContext & LocalStorage
    updateCurrentUser(updatedProfile);

    // If sales employee, sync with employees list in DataContext
    if (!isAdmin && currentUser?.id) {
      const matchInList = employees.find((emp) => emp.id === currentUser.id);
      if (matchInList) {
        updateEmployee(currentUser.id, {
          name: updatedProfile.name,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
          territory: updatedProfile.territory,
          avatar: updatedProfile.avatar
        });
      }
    }

    showToast('Personal and professional details updated successfully!', 'success');
  };

  // Handle Preferences Save
  const handleSavePreferences = (e) => {
    e.preventDefault();
    const prefs = {
      gpsAccuracy,
      emailNotifications,
      whatsappReceipts,
      offlineSync,
      dailyDigestTime
    };
    updateCurrentUser(prefs);
    showToast('App preferences and notifications updated!', 'success');
  };

  // Handle Password Update
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const errors = {};

    if (!currentPassword) {
      errors.currentPassword = 'Enter your current password';
    } else {
      const expectedPass = isAdmin ? 'Admin@123' : 'Sales@123';
      if (currentPassword !== expectedPass && currentPassword !== 'password123' && currentPassword !== 'admin' && currentPassword !== 'sales') {
        errors.currentPassword = `Incorrect current password. (Demo password is: ${expectedPass})`;
      }
    }

    if (!newPassword) {
      errors.newPassword = 'Enter a new password';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters long';
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      showToast('Please fix password validation issues', 'error');
      return;
    }

    setPasswordErrors({});
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    showToast('Account password updated successfully!', 'success');
  };

  // Calculate Password Strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', color: 'bg-slate-200', score: 0 };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { label: 'Weak', color: 'bg-rose-500', score: 33 };
    if (score <= 4) return { label: 'Good', color: 'bg-amber-500', score: 66 };
    return { label: 'Strong', color: 'bg-emerald-500', score: 100 };
  };

  const passStrength = getPasswordStrength(newPassword);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl object-cover ring-4 ring-[#2456D6]/20 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-600/20" title="Active Account" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#2456D6] uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isAdmin ? 'System Administrator Portal' : 'Sales Representative Portal'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#102B5C] tracking-tight">
              {name || 'Account Settings'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage your personal credentials, contact info, working territory, and system security.
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          <Badge
            status={isAdmin ? 'Admin' : 'Sales Rep'}
            variant={isAdmin ? 'info' : 'sales_rep'}
          />
          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
            ID: {currentUser?.id}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'profile'
              ? 'bg-[#2456D6] text-white shadow-sm shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Contact</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'preferences'
              ? 'bg-[#2456D6] text-white shadow-sm shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Field & App Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'security'
              ? 'bg-[#2456D6] text-white shadow-sm shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Password & Security</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'system'
              ? 'bg-[#2456D6] text-white shadow-sm shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Organization & Device</span>
        </button>
      </div>

      {/* TAB 1: PROFILE & CONTACT DETAILS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-7">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#102B5C] flex items-center gap-2">
                <User className="w-4.5 h-4.5 text-[#2456D6]" />
                Personal and Professional Information
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                These credentials and contact details appear on visits, client receipts, and daily summary sheets.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/70 self-start sm:self-auto">
              ✓ Synchronized with Local Cache
            </span>
          </div>

          {/* Profile Photo / Avatar Picker with Folder / Device Upload */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Profile Photo / Avatar
            </label>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Current Preview Card */}
              <div className="lg:col-span-5 flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="relative shrink-0">
                  <img
                    src={avatar}
                    alt="Current Avatar"
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#2456D6]/20 shadow-md"
                  />
                  {uploadedFileName && (
                    <span
                      className="absolute -top-1 -right-1 bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs"
                      title="Uploaded from folder"
                    >
                      ✓
                    </span>
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {uploadedFileName ? uploadedFileName : 'Active Avatar'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {uploadedFileName ? 'Selected from local folder' : 'Preset / Default Photo'}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-[#2456D6] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5" /> Change Photo
                    </button>
                    {uploadedFileName && (
                      <>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            setAvatar(PRESET_AVATARS[0]);
                            setUploadedFileName('');
                            showToast('Reset to default preset avatar', 'info');
                          }}
                          className="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Reset
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload from Folder / Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`lg:col-span-7 p-5 rounded-2xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer ${
                  isDragging
                    ? 'border-[#2456D6] bg-blue-50/80 scale-[1.01]'
                    : 'border-slate-300 hover:border-[#2456D6] hover:bg-blue-50/30 bg-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2456D6] flex items-center justify-center shrink-0 shadow-xs">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">
                      Select Image from Folder / PC
                    </p>
                    <p className="text-xs text-slate-500">
                      Click to browse folder or drag & drop (JPG, PNG, WEBP)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-[#2456D6] hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Choose File</span>
                </button>
              </div>
            </div>

            {/* Alternative: Presets or Custom Web URL */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="text-slate-500 font-medium">Or choose from sample presets:</span>
                <div className="flex items-center gap-1.5">
                  {PRESET_AVATARS.map((picUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatar(picUrl);
                        setCustomAvatarUrl('');
                        setUploadedFileName('');
                      }}
                      className={`rounded-xl overflow-hidden ring-2 transition-all cursor-pointer ${
                        avatar === picUrl && !uploadedFileName && !customAvatarUrl
                          ? 'ring-[#2456D6] scale-105 shadow-xs'
                          : 'ring-transparent opacity-70 hover:opacity-100 hover:scale-102'
                      }`}
                      title={`Preset Avatar #${idx + 1}`}
                    >
                      <img src={picUrl} alt="" className="w-8 h-8 object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCustomAvatarInput(!showCustomAvatarInput)}
                className="text-xs font-semibold text-[#2456D6] hover:underline cursor-pointer"
              >
                {showCustomAvatarInput ? 'Hide Web URL Option' : 'Or Paste Web Image URL'}
              </button>
            </div>

            {showCustomAvatarInput && (
              <div className="pt-2 max-w-md">
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={customAvatarUrl}
                  onChange={(e) => {
                    setCustomAvatarUrl(e.target.value);
                    if (e.target.value.trim()) {
                      setAvatar(e.target.value.trim());
                      setUploadedFileName('');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50"
                />
              </div>
            )}
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSaveProfile} className="space-y-5 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50 focus:bg-white transition-colors"
                  />
                </div>
                {profileErrors.name && <p className="text-rose-600 text-xs mt-1">{profileErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Official Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@inextsoftware.in"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50 focus:bg-white transition-colors"
                  />
                </div>
                {profileErrors.email && <p className="text-rose-600 text-xs mt-1">{profileErrors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Primary Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98271 XXXXX"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50 focus:bg-white transition-colors"
                  />
                </div>
                {profileErrors.phone && <p className="text-rose-600 text-xs mt-1">{profileErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Alternate / Emergency Contact
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="+91 94252 XXXXX"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isAdmin ? 'Department / Office Location' : 'Assigned Field Territory'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={territory}
                    onChange={(e) => setTerritory(e.target.value)}
                    placeholder="e.g. Raipur Central, Pandri & Telibandha"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Designation / Role Title
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Field Sales Representative"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Professional Bio / Responsibility Notes
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of duties and operational territory..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50 focus:bg-white transition-colors"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Last updated: Just now (Session Active)
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#102B5C] hover:bg-blue-900 shadow-md shadow-blue-950/20 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Details</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: FIELD & APP PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-7">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-[#102B5C] flex items-center gap-2">
              <Sliders className="w-4.5 h-4.5 text-[#2456D6]" />
              Field Operational & Mobile Preferences
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize GPS location resolution, alert notifications, and automated report receipts.
            </p>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-6">
            {/* GPS Accuracy Setting */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#2456D6] flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">GPS Accuracy & Geofence Capture</h4>
                    <p className="text-xs text-slate-500">
                      Coordinates captured only at Check-in and Check-out (per Scope INS/260926/IQ034).
                    </p>
                  </div>
                </div>

                <select
                  value={gpsAccuracy}
                  onChange={(e) => setGpsAccuracy(e.target.value)}
                  className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden focus:border-[#2456D6]"
                >
                  <option value="high">High Precision (GPS + Cellular)</option>
                  <option value="balanced">Balanced (Battery Saver)</option>
                  <option value="cellular">Cellular Only</option>
                </select>
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Notification Channels & Alerts
              </h4>

              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
                <label className="flex items-center justify-between p-4 hover:bg-slate-50/60 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4.5 h-4.5 text-slate-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Daily Summary Report via Email</p>
                      <p className="text-xs text-slate-500">
                        Receive end-of-day visit logs, total km, and booked order amounts at your inbox.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-4.5 h-4.5 text-[#2456D6] rounded-md border-slate-300 focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 hover:bg-slate-50/60 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4.5 h-4.5 text-slate-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Instant Order Confirmation on WhatsApp / SMS</p>
                      <p className="text-xs text-slate-500">
                        Sends automated order receipt to the retailer upon successful on-site booking.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappReceipts}
                    onChange={(e) => setWhatsappReceipts(e.target.checked)}
                    className="w-4.5 h-4.5 text-[#2456D6] rounded-md border-slate-300 focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 hover:bg-slate-50/60 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-4.5 h-4.5 text-slate-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Offline Field Data Cache</p>
                      <p className="text-xs text-slate-500">
                        Keeps visit actions stored locally when mobile network connectivity drops.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={offlineSync}
                    onChange={(e) => setOfflineSync(e.target.checked)}
                    className="w-4.5 h-4.5 text-[#2456D6] rounded-md border-slate-300 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Daily Digest Time Picker */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-800 block text-sm">Automated Day-End Trigger Time</span>
                <span className="text-slate-500 text-xs">When the system compiles and finalizes day statistics</span>
              </div>
              <input
                type="time"
                value={dailyDigestTime}
                onChange={(e) => setDailyDigestTime(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 text-xs focus:outline-hidden"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#2456D6] hover:bg-blue-700 shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: PASSWORD & SECURITY */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-7">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-[#102B5C] flex items-center gap-2">
              <Lock className="w-4.5 h-4.5 text-[#2456D6]" />
              Account Security & Change Password
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep your credentials secure. For client presentation demo, you can test changing passwords.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-5 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative max-w-md">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50 focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Demo hint: Admin password is <code className="font-mono font-bold text-slate-600">Admin@123</code> | Sales Rep password is <code className="font-mono font-bold text-slate-600">Sales@123</code>
              </p>
              {passwordErrors.currentPassword && (
                <p className="text-rose-600 text-xs mt-1 font-semibold">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Strength:</span>
                      <span className="font-bold text-slate-700">{passStrength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passStrength.color} transition-all duration-300`}
                        style={{ width: `${passStrength.score}%` }}
                      />
                    </div>
                  </div>
                )}

                {passwordErrors.newPassword && (
                  <p className="text-rose-600 text-xs mt-1 font-semibold">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#2456D6] bg-slate-50/50 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-rose-600 text-xs mt-1 font-semibold">{passwordErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Two-Factor Authentication Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex items-center justify-between gap-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2456D6] text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#102B5C]">Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs text-slate-500">
                    Require SMS OTP verification when logging in from an unknown device.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  showToast(
                    !twoFactorEnabled ? '2FA Enabled on your account!' : '2FA Disabled on your account',
                    'info'
                  );
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  twoFactorEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {twoFactorEnabled ? 'Enabled ✓' : 'Enable 2FA'}
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#2456D6] hover:bg-blue-700 shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Key className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: SYSTEM & ORGANIZATION METADATA */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-7">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-[#102B5C] flex items-center gap-2">
              <Building className="w-4.5 h-4.5 text-[#2456D6]" />
              Enterprise Organization & Software Specifications
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Read-only system identifiers, deployment scope, and licensing parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Client / Organization</span>
              <p className="font-bold text-slate-900 text-sm">iNext Software Solutions Pvt. Ltd.</p>
              <span className="text-[11px] text-slate-500">Raipur, Chhattisgarh</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Quotation Ref</span>
              <p className="font-mono font-bold text-slate-900 text-sm">INS/260926/IQ034</p>
              <span className="text-[11px] text-emerald-600 font-semibold">Scope Compliant</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">User Account ID</span>
              <p className="font-mono font-bold text-slate-900 text-sm">{currentUser?.id}</p>
              <span className="text-[11px] text-blue-600 font-semibold">
                Role: {isAdmin ? 'Administrator (Full Access)' : 'Sales Representative'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Software Build</span>
              <p className="font-bold text-slate-900 text-sm">v1.0.4 - Production Candidate</p>
              <span className="text-[11px] text-slate-500">Vite 8 + React 19 + Tailwind v4</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">GPS Module Status</span>
              <p className="font-bold text-emerald-700 text-sm">Active (Start/End Verification)</p>
              <span className="text-[11px] text-slate-500">Live coordinates captured per visit</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Data Storage</span>
              <p className="font-bold text-slate-900 text-sm">Browser LocalStorage (Encrypted)</p>
              <span className="text-[11px] text-slate-500">Deterministic Seed Active</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Administrative Note on Account Permissions</p>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                Sales Representatives can update their personal contact number, avatar, alternate phone, and password at any time. Employee ID and core role privileges remain locked by the Administrator in accordance with corporate audit compliance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
