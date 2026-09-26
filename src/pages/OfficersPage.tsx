import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Mail,
  Building,
  UserPlus,
  Phone,
  BadgeCheck,
  MapPin,
  Fingerprint,
  Calendar,
  X,
  Search,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Star,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { Role, User } from '../types';
import { GovtInteroperabilityHub } from '../components/admin/GovtInteroperabilityHub';

export const OfficersPage: React.FC = () => {
  const navigate = useNavigate();
  const { allUsers, currentUser, switchUser, files, addOfficer } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterDistrict, setFilterDistrict] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOfficerDetails, setSelectedOfficerDetails] = useState<User | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Form State for Adding New Officer
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    role: 'District Officer' as Role,
    department: 'District Revenue Office',
    district: 'Jaipur',
    email: '',
    phone: '',
    employeeId: '',
    jurisdiction: 'Jaipur East & Chomu Sub-Division',
    dscStatus: 'ACTIVE' as 'ACTIVE' | 'PENDING' | 'EXPIRED',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const email =
      formData.email.trim() ||
      `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@bhumi.demo`;
    const employeeId =
      formData.employeeId.trim() ||
      `GOV-RJ-${Math.floor(1000 + Math.random() * 9000)}`;
    const phone =
      formData.phone.trim() ||
      `+91 98290 ${Math.floor(10000 + Math.random() * 90000)}`;

    const newOfficer = addOfficer({
      name: formData.name.trim(),
      designation:
        formData.designation.trim() ||
        `${formData.role} (${formData.department})`,
      role: formData.role,
      department: formData.department,
      district: formData.district,
      email,
      phone,
      employeeId,
      jurisdiction: formData.jurisdiction,
      dscStatus: formData.dscStatus,
      state: 'Rajasthan',
    });

    setRecentlyAddedId(newOfficer.id);
    setIsAddModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      designation: '',
      role: 'District Officer',
      department: 'District Revenue Office',
      district: 'Jaipur',
      email: '',
      phone: '',
      employeeId: '',
      jurisdiction: 'Jaipur East & Chomu Sub-Division',
      dscStatus: 'ACTIVE',
    });
  };

  // Filtered Users with defensive checks
  const safeUsers = Array.isArray(allUsers) ? allUsers : [];
  const filteredUsers = safeUsers.filter((user) => {
    if (!user) return false;
    if (filterRole !== 'ALL' && user.role !== filterRole) return false;
    if (filterDistrict !== 'ALL' && user.district !== filterDistrict) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = typeof user.name === 'string' && user.name.toLowerCase().includes(q);
      const matchRole = typeof user.role === 'string' && user.role.toLowerCase().includes(q);
      const matchDept = typeof user.department === 'string' && user.department.toLowerCase().includes(q);
      const matchEmail = typeof user.email === 'string' && user.email.toLowerCase().includes(q);
      const matchDistrict = typeof user.district === 'string' && user.district.toLowerCase().includes(q);
      return matchName || matchRole || matchDept || matchEmail || matchDistrict;
    }
    return true;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Officer Directory & Statutory Personnel Registry
              </h1>
              <p className="text-xs text-slate-500">
                Official registry of authorized Land Acquisition, Survey, Legal, and Finance officers across all districts.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Gateway & Onboard New Officer */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const el = document.getElementById('govt-interoperability-hub');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Govt Web & App Gateway</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add New Officer</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by officer name, employee ID, role, or department..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-hidden"
          >
            <option value="ALL">All Statutory Roles</option>
            <option value="National Admin">National Admin</option>
            <option value="State Officer">State Officer</option>
            <option value="District Officer">District Officer</option>
            <option value="Survey Officer">Survey Officer</option>
            <option value="Legal Officer">Legal Officer</option>
            <option value="Finance Officer">Finance Officer</option>
            <option value="Project Authority">Project Authority</option>
          </select>

          {/* District Filter */}
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-hidden"
          >
            <option value="ALL">All Districts</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Alwar">Alwar</option>
            <option value="Ajmer">Ajmer</option>
            <option value="Kota">Kota</option>
            <option value="Dausa">Dausa</option>
            <option value="Jodhpur">Jodhpur</option>
            <option value="Bikaner">Bikaner</option>
            <option value="Bundi">Bundi</option>
            <option value="Udaipur">Udaipur</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredUsers.length}</strong> of {allUsers.length} Officers
        </div>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((user) => {
          const isSelected = currentUser.id === user.id;
          const isRecentlyAdded = recentlyAddedId === user.id;
          const roleName = user.role.toLowerCase().replace(' officer', '').trim();
          const userFiles = files.filter((f) =>
            f.currentOfficer.toLowerCase().includes(roleName)
          );

          return (
            <div
              key={user.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 relative ${
                isSelected
                  ? 'bg-blue-50/50 border-blue-400 ring-2 ring-blue-500/20 shadow-md'
                  : isRecentlyAdded
                  ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
              }`}
            >
              {isRecentlyAdded && (
                <span className="absolute -top-2.5 right-4 bg-emerald-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow-sm tracking-wider">
                  ★ Newly Added Officer
                </span>
              )}

              <div className="space-y-3">
                {/* ID & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {user.employeeId || user.id}
                    </span>
                    {user.dscStatus === 'ACTIVE' && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Fingerprint className="w-2.5 h-2.5 text-emerald-600" /> DSC Active
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <UserCheck className="w-3 h-3" /> Active Session
                    </span>
                  )}
                </div>

                {/* Profile Header */}
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-700/90 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug truncate">
                      {user.name}
                    </h3>
                    <p className="text-xs text-blue-700 font-bold">{user.role}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                      {user.designation}
                    </p>
                  </div>
                </div>

                {/* Granular Metadata Badges */}
                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="flex items-center gap-1.5 truncate">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{user.department}</span>
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{user.district || 'Rajasthan Headquarter'} Jurisdiction</span>
                  </p>
                  <p className="flex items-center gap-1.5 truncate font-mono text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                  {user.phone && (
                    <p className="flex items-center gap-1.5 truncate font-mono text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{user.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Footer Workload and Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedOfficerDetails(user)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition-colors"
                >
                  View Details
                </button>

                <button
                  onClick={() => {
                    switchUser(user.id);
                    navigate('/portal');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                      : 'bg-slate-900 text-white hover:bg-blue-600 shadow-2xs'
                  }`}
                >
                  <span>{isSelected ? 'Open Portal' : 'Switch Persona'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* ADD NEW OFFICER MODAL */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-7 my-8 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Onboard New Statutory Officer
                  </h2>
                  <p className="text-xs text-slate-500">
                    Register a new administrative officer into the Land Acquisition ERP workflow.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSubmit} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Officer Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meera Sharma, RAS"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Designation / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Special Land Acquisition Officer (SLAO)"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Statutory Role Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as Role })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="District Officer">District Officer (ADM / SLAO)</option>
                    <option value="Survey Officer">Survey Officer (Cadastral / DGPS)</option>
                    <option value="Legal Officer">Legal Officer (Dispute Arbiter)</option>
                    <option value="Finance Officer">Finance Officer (Compensation & CAO)</option>
                    <option value="Project Authority">Project Authority (NHAI / RIICO)</option>
                    <option value="State Officer">State Officer (Revenue Dept)</option>
                    <option value="National Admin">National Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Government Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="District Revenue Office">District Revenue Office</option>
                    <option value="Directorate of Land Records & Survey">
                      Directorate of Land Records & Survey
                    </option>
                    <option value="Revenue Legal Cell">Revenue Legal Cell</option>
                    <option value="District Finance & Treasury">District Finance & Treasury</option>
                    <option value="National Highway Authority of India (NHAI)">
                      National Highway Authority of India (NHAI)
                    </option>
                    <option value="State Revenue Department">State Revenue Department</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    District Jurisdiction
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Jaipur">Jaipur</option>
                    <option value="Alwar">Alwar</option>
                    <option value="Ajmer">Ajmer</option>
                    <option value="Kota">Kota</option>
                    <option value="Dausa">Dausa</option>
                    <option value="Jodhpur">Jodhpur</option>
                    <option value="Bikaner">Bikaner</option>
                    <option value="Bundi">Bundi</option>
                    <option value="Udaipur">Udaipur</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Sub-Division / Jurisdiction Area
                  </label>
                  <input
                    type="text"
                    value={formData.jurisdiction}
                    onChange={(e) =>
                      setFormData({ ...formData, jurisdiction: e.target.value })
                    }
                    placeholder="e.g. Sanganer & Bassi Tehsils"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Employee / SSO ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GOV-RJ-7821"
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    placeholder="officer@bhumi.demo"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98290 XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Class-3 DSC Security Option */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Fingerprint className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">Class-3 Digital Signature Certificate</span>
                    <span className="text-[10px] text-slate-500">
                      Enable statutory e-sign capability for land award approvals
                    </span>
                  </div>
                </div>
                <select
                  value={formData.dscStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dscStatus: e.target.value as 'ACTIVE' | 'PENDING' | 'EXPIRED',
                    })
                  }
                  className="bg-white border border-blue-300 rounded-lg px-2.5 py-1 text-xs font-bold text-blue-800"
                >
                  <option value="ACTIVE">DSC Active</option>
                  <option value="PENDING">Pending Verification</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Onboard & Save Officer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OFFICER DETAILS DOSSIER MODAL */}
      {/* ========================================================================= */}
      {selectedOfficerDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95 duration-150 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-blue-500/20">
                  {selectedOfficerDetails.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {selectedOfficerDetails.name}
                  </h3>
                  <p className="text-xs text-blue-700 font-bold">{selectedOfficerDetails.role}</p>
                  <p className="text-[11px] text-slate-500">{selectedOfficerDetails.designation}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOfficerDetails(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comprehensive Detail Fields */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Employee / SSO Code</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedOfficerDetails.employeeId || selectedOfficerDetails.id}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Department</span>
                <span className="font-semibold text-slate-800 text-right">
                  {selectedOfficerDetails.department}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">District & Jurisdiction</span>
                <span className="font-semibold text-slate-800 text-right">
                  {selectedOfficerDetails.district || 'Rajasthan'} ·{' '}
                  {selectedOfficerDetails.jurisdiction || 'District Sub-Division'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Digital Signature (DSC)</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <Fingerprint className="w-3 h-3" /> Class 3 e-Sign Certified
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Official Email</span>
                <span className="font-mono text-slate-800">{selectedOfficerDetails.email}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Phone Number</span>
                <span className="font-mono text-slate-800">
                  {selectedOfficerDetails.phone || '+91 98290 12345'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-slate-500 font-medium">SLA Compliance Rating</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{selectedOfficerDetails.rating || 4.9} / 5.0</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedOfficerDetails(null);
                  switchUser(selectedOfficerDetails.id);
                  navigate('/portal');
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center space-x-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Simulate & Open Officer Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Government Web & App Interoperability Gateway Section */}
      <div id="govt-interoperability-hub" className="pt-4">
        <GovtInteroperabilityHub />
      </div>
    </div>
  );
};
