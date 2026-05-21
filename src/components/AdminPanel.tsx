/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Lock, Unlock, Key, Search, Trash2, Download, 
  RefreshCw, SlidersHorizontal, Eye, X, Filter,
  Users, Award, Calendar, ChevronLeft, HelpCircle,
  FileSpreadsheet, Sparkles, Check, AlertCircle, Edit3
} from 'lucide-react';
import { RegistrationRecord } from '../types';
import { fetchRegistrations, deleteRegistration } from '../lib/supabaseService';
import SuccessView from './SuccessView';

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  // Authentication & Security State
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('ECI 2026');
  
  // Settings Mode
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwdChangeError, setPwdChangeError] = useState('');
  const [pwdChangeSuccess, setPwdChangeSuccess] = useState(false);

  // Database / Data lists state
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Search, Sort, Filter Parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterInterest, setFilterInterest] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name-asc' | 'name-desc'>('newest');

  // Inspection states
  const [selectedRecord, setSelectedRecord] = useState<RegistrationRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<RegistrationRecord | null>(null);

  // Initialize and load saved password from localStorage
  useEffect(() => {
    const savedPassword = localStorage.getItem('eci_admin_password');
    if (savedPassword) {
      setCurrentPassword(savedPassword);
    }
  }, []);

  // Fetch registrations once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchRegistrations();
      setRecords(data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchRegistrations();
      setRecords(data);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Password Gate Submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === currentPassword) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Kata sandi yang Anda masukkan salah. Silakan coba lagi.');
    }
  };

  // Change Password Handle
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setPwdChangeError('Kata sandi baru tidak boleh kosong.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwdChangeError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    
    // Save to State and LocalStorage
    localStorage.setItem('eci_admin_password', newPassword);
    setCurrentPassword(newPassword);
    setNewPassword('');
    setConfirmNewPassword('');
    setPwdChangeError('');
    setPwdChangeSuccess(true);
    
    setTimeout(() => {
      setPwdChangeSuccess(false);
      setShowPasswordChangeModal(false);
    }, 2000);
  };

  // Delete Handlers
  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;
    try {
      const success = await deleteRegistration(recordToDelete.id);
      if (success) {
        setRecords(prev => prev.filter(r => r.id !== recordToDelete.id));
        setRecordToDelete(null);
      } else {
        alert('Gagal menghapus data dari Supabase. Periksa koneksi internet Anda.');
      }
    } catch (err) {
      console.error('Failed to trigger deletion:', err);
    }
  };

  // Export database to CSV (Safe Excel UTF-8)
  const handleExportCSV = () => {
    if (records.length === 0) return;
    
    // CSV Headers
    const headers = [
      'ID Registrasi', 
      'Nama Lengkap', 
      'Tanggal Lahir', 
      'Gender', 
      'Status', 
      'Bidang Minat', 
      'Pengetahuan Minat', 
      'Alasan Bergabung', 
      'Tanggal Registrasi'
    ];

    // CSV Rows construction
    const rows = records.map(r => [
      r.id,
      r.fullName.replace(/"/g, '""'),
      r.birthDate,
      r.gender,
      r.status,
      r.interest,
      r.interestKnowledge.replace(/"/g, '""'),
      r.joinReason.replace(/"/g, '""'),
      r.registrationDate
    ]);

    // Build the CSV String with BOM for absolute compatibility with Excel mapping
    const csvContent = "\uFEFF" + [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Pendaftaran_ECI_Export_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search calculation
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          record.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = filterGender === '' || record.gender === filterGender;
    const matchesStatus = filterStatus === '' || record.status === filterStatus;
    const matchesInterest = filterInterest === '' || record.interest === filterInterest;
    return matchesSearch && matchesGender && matchesStatus && matchesInterest;
  });

  // Sorting calculation
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.id.localeCompare(a.id); // Simple chronological by order key / sub-id keys
    }
    if (sortBy === 'oldest') {
      return a.id.localeCompare(b.id);
    }
    if (sortBy === 'name-asc') {
      return a.fullName.localeCompare(b.fullName);
    }
    if (sortBy === 'name-desc') {
      return b.fullName.localeCompare(a.fullName);
    }
    return 0;
  });

  // Calculate statistics bento values
  const totalSubmissions = records.length;
  const lakiPercentage = totalSubmissions > 0 
    ? Math.round((records.filter(r => r.gender === 'Laki-laki').length / totalSubmissions) * 100) 
    : 0;
  const perempuanPercentage = totalSubmissions > 0 
    ? Math.round((records.filter(r => r.gender === 'Perempuan').length / totalSubmissions) * 100) 
    : 0;

  // Find most popular Interest
  const interestCounts: { [key: string]: number } = {};
  records.forEach(r => {
    if (r.interest) {
      interestCounts[r.interest] = (interestCounts[r.interest] || 0) + 1;
    }
  });
  
  let topInterestName = '-';
  let topInterestCount = 0;
  Object.entries(interestCounts).forEach(([name, count]) => {
    if (count > topInterestCount) {
      topInterestCount = count;
      topInterestName = name;
    }
  });

  // Get breakdown of status for bento
  const statusCounts = {
    Pelajar: records.filter(r => r.status === 'Pelajar').length,
    Mahasiswa: records.filter(r => r.status === 'Mahasiswa').length,
    Bekerja: records.filter(r => r.status === 'Bekerja').length,
    Lainnya: records.filter(r => r.status === 'Berkeluarga').length + records.filter(r => r.status === 'Lainnya').length,
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-start relative max-w-7xl mx-auto px-4 md:px-6">
      
      {/* 1. PASSWORD LOCKSCREEN SCREEN */}
      {!isAuthenticated ? (
        <div className="min-h-[70vh] flex items-center justify-center py-12">
          <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-sky-600"></div>
            
            <div className="mx-auto w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-5 border border-sky-100">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-heading">Portal Administrator ECI</h3>
            <p className="text-[11.5px] text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
              Silakan masukkan sandi otorisasi Admin Anda untuk mengakses database pendaftaran calon anggota.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <input
                  id="admin-password-access-input"
                  type="password"
                  placeholder="Masukkan password admin"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full text-center tracking-widest font-mono text-xs px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-100 bg-slate-50/50"
                  autoFocus
                />
                {authError && (
                  <p className="text-[10px] text-rose-500 mt-2 font-medium flex items-center justify-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    {authError}
                  </p>
                )}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  id="admin-login-back-btn"
                  type="button"
                  onClick={onBack}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors"
                >
                  Kembali ke Form
                </button>
                <button
                  id="admin-login-submit-btn"
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-all flex items-center justify-center space-x-1 shadow-soft"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Akses Database</span>
                </button>
              </div>
            </form>

            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-mono">
              <span>ECI INTERNAL AUTHORIZATION V1.0</span>
            </div>
          </div>
        </div>
      ) : (
        
        /* 2. ADMIN DASHBOARD VIEW PANEL */
        <div className="py-6 space-y-6">
          
          {/* Header Action Menu */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center space-x-3">
              <button
                id="admin-panel-back-to-form-btn"
                onClick={onBack}
                className="p-2 border border-slate-150 hover:bg-slate-50 bg-white rounded-lg transition-colors"
                title="Kembali ke portal depan"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase bg-sky-50 text-sky-700 px-2.5 py-1 rounded">ADMIN MODE</span>
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                    Live Supabase
                  </span>
                </div>
                <h2 className="text-xl font-bold font-heading text-slate-900 tracking-tight mt-1">Dashboard Pengelola Pendaftaran</h2>
              </div>
            </div>

            {/* Admin actions: CSV export & password reset */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="admin-btn-change-pwd"
                onClick={() => setShowPasswordChangeModal(true)}
                className="px-4 py-2 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center space-x-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Ganti Password Admin</span>
              </button>

              <button
                id="admin-btn-export-csv"
                onClick={handleExportCSV}
                disabled={records.length === 0}
                className="px-4 py-2 text-[11px] font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 border border-sky-100 hover:bg-sky-100 rounded-lg transition-colors flex items-center space-x-1.5 disabled:opacity-55 disabled:cursor-not-allowed"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Ekspor CSV (Excel)</span>
              </button>
              
              <button
                id="admin-btn-refresh-data"
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 border border-slate-200 hover:bg-slate-50 bg-white rounded-lg transition-all text-slate-600"
                title="Sinkronisasi Ulang Database"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* 3. BENTO STATISTICS COMPACT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Bento 1: Total Submission Count */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-soft flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-semibold block">Total Pengaju</span>
                <span className="text-2xl font-bold font-heading text-slate-900 mt-1.5 block">{loading ? '...' : totalSubmissions}</span>
                <span className="text-[9.5px] text-slate-500 font-smooth mt-0.5 block">calon anggota terdaftar</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Bento 2: Gender Demographics */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-soft">
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-semibold block mb-2">Proporsi Gender</span>
              {loading ? (
                <span className="text-xs text-slate-400 block py-1">Memproses...</span>
              ) : totalSubmissions === 0 ? (
                <span className="text-xs text-slate-500 block py-1">Belum ada data</span>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-mono text-slate-600">
                    <span>Laki-Laki ({lakiPercentage}%)</span>
                    <span>Perempuan ({perempuanPercentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                    <div className="h-full bg-sky-500" style={{ width: `${lakiPercentage}%` }}></div>
                    <div className="h-full bg-pink-400" style={{ width: `${perempuanPercentage}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Bento 3: Top Minat Area */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-soft flex items-center justify-between">
              <div className="max-w-[75%]">
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-semibold block">Peminatan Terfavorit</span>
                <span className="text-[11.5px] font-bold text-slate-800 tracking-tight mt-1.5 block truncate leading-tight">
                  {loading ? '...' : topInterestName}
                </span>
                <span className="text-[9.5px] text-slate-400 mt-0.5 block font-mono">
                  {loading ? '' : topInterestCount > 0 ? `${topInterestCount} Pemilih` : 'Belum memilih'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
            </div>

            {/* Bento 4: Kesibukan Status Split */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-soft">
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-semibold block mb-1">Status Kesibukan</span>
              {loading ? (
                <span className="text-xs text-slate-400 block">Memproses...</span>
              ) : (
                <div className="grid grid-cols-4 gap-1 text-center mt-1">
                  <div className="bg-sky-50 rounded py-1 px-0.5">
                    <span className="block text-xs font-bold text-sky-700">{statusCounts.Pelajar}</span>
                    <span className="text-[8px] text-sky-500 font-mono">SMP/SMA</span>
                  </div>
                  <div className="bg-emerald-50 rounded py-1 px-0.5">
                    <span className="block text-xs font-bold text-emerald-700">{statusCounts.Mahasiswa}</span>
                    <span className="text-[8px] text-emerald-500 font-mono">Kuliah</span>
                  </div>
                  <div className="bg-amber-50 rounded py-1 px-0.5">
                    <span className="block text-xs font-bold text-amber-700">{statusCounts.Bekerja}</span>
                    <span className="text-[8px] text-amber-500 font-mono">Kerja</span>
                  </div>
                  <div className="bg-slate-100 rounded py-1 px-0.5">
                    <span className="block text-xs font-bold text-slate-700">{statusCounts.Lainnya}</span>
                    <span className="text-[8px] text-slate-500 font-mono">Lainnya</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* 4. FILTER CONTROL BAR (SEARCH AND FILTER) */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-soft">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3.5">
              
              {/* Search Bar Input */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-450" />
                <input
                  id="admin-search-input"
                  type="text"
                  placeholder="Cari nama atau ID Pendaftaran..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8.5 pr-3 py-2 border border-slate-200/80 rounded-lg focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-100 bg-slate-50/20 font-smooth"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Advanced Filter grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                {/* Gender select */}
                <div>
                  <select
                    id="admin-filter-gender"
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:border-sky-500 focus:outline-none appearance-none cursor-pointer bg-white"
                  >
                    <option value="">Semua Gender</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                
                {/* Kesibukan status */}
                <div>
                  <select
                    id="admin-filter-status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:border-sky-500 focus:outline-none appearance-none cursor-pointer bg-white"
                  >
                    <option value="">Semua Kesibukan</option>
                    <option value="Pelajar">Pelajar</option>
                    <option value="Mahasiswa">Mahasiswa</option>
                    <option value="Bekerja">Bekerja</option>
                    <option value="Berkeluarga">Berkeluarga</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Minat interest focus */}
                <div>
                  <select
                    id="admin-filter-interest"
                    value={filterInterest}
                    onChange={(e) => setFilterInterest(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:border-sky-500 focus:outline-none appearance-none cursor-pointer bg-white"
                  >
                    <option value="">Semua Minat</option>
                    <option value="Astronomi">Astronomi</option>
                    <option value="History/Sejarah">Sejarah</option>
                    <option value="Teknologi informasi & Coding">TI & Coding</option>
                    <option value="Psikologi & Mental health">Psikologi</option>
                    <option value="Linguistik & Bahasa asing">Bahasa Asing</option>
                    <option value="Sastra & Kepenulisan kreatif">Sastra</option>
                    <option value="Fisika & Matematika murni">Fisika & MTK</option>
                    <option value="Desain grafis & Visual">Desain Grafis</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Sorting parameters */}
                <div>
                  <select
                    id="admin-filter-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:border-sky-500 focus:outline-none appearance-none cursor-pointer bg-white text-slate-800"
                  >
                    <option value="newest">Baru ke Lama</option>
                    <option value="oldest">Lama ke Baru</option>
                    <option value="name-asc">Nama A - Z</option>
                    <option value="name-desc">Nama Z - A</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* 5. DATA TABLE LIST OF SUBMISSIONS */}
          <div className="bg-white border border-slate-200/85 rounded-xl shadow-card overflow-hidden">
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-7 h-7 text-sky-600 animate-spin mx-auto animate-duration-300" />
                <p className="text-xs text-slate-400 font-mono uppercase tracking-wide">MENGAMBIL DATABASE SUPABASE...</p>
              </div>
            ) : sortedRecords.length === 0 ? (
              <div className="py-16 text-center text-slate-400 px-6">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-xs font-semibold text-slate-700">Tidak ada pendaftaran ditemukan</p>
                <p className="text-[10.5px] mt-1 max-w-xs mx-auto leading-relaxed">
                  {records.length === 0 
                    ? 'Belum ada peserta yang melakukan registrasi melalui portal ini.' 
                    : 'Tidak ada data registrasi yang sesuai dengan kriteria pencarian dan filter Anda.'}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View (Visible starting at md screens) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                        <th className="px-5 py-3 font-semibold">Foto</th>
                        <th className="px-5 py-3 font-semibold">ID & Tanggal</th>
                        <th className="px-5 py-3 font-semibold">Nama Lengkap</th>
                        <th className="px-5 py-3 font-semibold">Profil Demografis</th>
                        <th className="px-5 py-3 font-semibold">Minat Spesifik</th>
                        <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {sortedRecords.map((record) => (
                        <tr 
                          id={`row-record-${record.id}`}
                          key={record.id} 
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          {/* Profile Picture thumbnail */}
                          <td className="px-5 py-3 shrink-0">
                            <div className="w-9 h-9 rounded-full border border-slate-150 p-0.5 bg-white overflow-hidden shadow-soft">
                              <img 
                                src={record.profilePicture} 
                                alt="Thumbnail" 
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                  // Fallback avatar if error
                                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(record.fullName)}`;
                                }}
                              />
                            </div>
                          </td>

                          {/* Unique ID & Submission Date */}
                          <td className="px-5 py-3 font-mono">
                            <span className="block font-bold text-slate-900 tracking-tight">{record.id}</span>
                            <span className="text-[9px] text-slate-450">{record.registrationDate}</span>
                          </td>

                          {/* Name (bold & clean) */}
                          <td className="px-5 py-3 font-medium text-slate-905 font-heading">
                            {record.fullName}
                          </td>

                          {/* Demographic: Gender & Occupation */}
                          <td className="px-5 py-3 space-y-1">
                            <span className="block">{record.birthDate}</span>
                            <div className="flex flex-wrap items-center gap-1.5 text-[9.5px] font-mono">
                              <span className={`px-1.5 py-0.5 rounded leading-none ${record.gender === 'Laki-laki' ? 'bg-sky-50 text-sky-700 border border-sky-100' : 'bg-pink-50 text-pink-700 border border-pink-100'}`}>
                                {record.gender}
                              </span>
                              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded leading-none">
                                {record.status}
                              </span>
                            </div>
                          </td>

                          {/* Interest details */}
                          <td className="px-5 py-3 max-w-[200px]">
                            <span className="block font-semibold text-indigo-600 truncate">{record.interest}</span>
                            <span className="text-[10px] text-slate-400 block truncate" title={record.interestKnowledge}>
                              {record.interestKnowledge}
                            </span>
                          </td>

                          {/* Actions triggers */}
                          <td className="px-5 py-3 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              
                              {/* Inspect credential form & member card */}
                              <button
                                id={`inspect-btn-${record.id}`}
                                onClick={() => setSelectedRecord(record)}
                                className="p-1.5 hover:bg-sky-50 text-sky-600 hover:text-sky-700 rounded-md transition-colors border border-transparent hover:border-sky-100/40"
                                title="Lihat & Download Kartu / Dokumen"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Delete submission */}
                              <button
                                id={`delete-btn-${record.id}`}
                                onClick={() => setRecordToDelete(record)}
                                className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-md transition-colors border border-transparent hover:border-rose-100/40"
                                title="Hapus Registrasi"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View (Visible on mobile screens) */}
                <div className="block md:hidden divide-y divide-slate-100">
                  {sortedRecords.map((record) => (
                    <div 
                      id={`card-record-${record.id}`}
                      key={record.id} 
                      className="p-5 hover:bg-slate-50/40 transition-colors space-y-4"
                    >
                      {/* Header: Photo, Name, and Quick Actions */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-11 h-11 rounded-full border border-slate-150 p-0.5 bg-white overflow-hidden shadow-soft shrink-0">
                            <img 
                              src={record.profilePicture} 
                              alt="Thumbnail" 
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(record.fullName)}`;
                              }}
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 font-heading text-[13px] leading-tight">
                              {record.fullName}
                            </h4>
                            <span className="font-mono text-[9px] text-sky-600 font-bold block mt-0.5">
                              {record.id}
                            </span>
                          </div>
                        </div>
                        
                        {/* Top-Right Actions */}
                        <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-100 rounded-lg p-1">
                          <button
                            id={`inspect-btn-mobile-${record.id}`}
                            onClick={() => setSelectedRecord(record)}
                            className="p-1.5 hover:bg-white text-sky-600 rounded-md transition-all shrink-0"
                            title="Lihat & Download"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-btn-mobile-${record.id}`}
                            onClick={() => setRecordToDelete(record)}
                            className="p-1.5 hover:bg-white text-rose-500 rounded-md transition-all shrink-0"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[10.5px] bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-[8px] text-slate-400 font-mono uppercase tracking-wider block">Tanggal Lahir</span>
                          <span className="font-medium text-slate-700">{record.birthDate}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 font-mono uppercase tracking-wider block">Gender</span>
                          <span className={`inline-block px-1.5 py-0.5 mt-0.5 rounded leading-none text-[9px] font-mono ${
                            record.gender === 'Laki-laki' ? 'bg-sky-50 text-sky-700 border border-sky-100' : 'bg-pink-50 text-pink-700 border border-pink-100'
                          }`}>
                            {record.gender}
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 font-mono uppercase tracking-wider block">Status Kesibukan</span>
                          <span className="font-medium text-slate-700">{record.status}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 font-mono uppercase tracking-wider block">Tanggal Registrasi</span>
                          <span className="font-medium text-slate-600">{record.registrationDate}</span>
                        </div>
                      </div>

                      {/* Interest Chosen */}
                      <div className="text-[11px]">
                        <span className="text-[8px] text-slate-400 font-mono uppercase tracking-wider block mb-0.5">Bidang Minat Terpilih</span>
                        <span className="font-bold text-indigo-600 text-[11px] block">{record.interest}</span>
                        {record.interestKnowledge && (
                          <p className="text-[10px] text-slate-400 font-smooth italic mt-1 bg-white p-2 rounded border border-slate-100/60 line-clamp-2">
                            "{record.interestKnowledge}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      )}

      {/* ================= MODAL OVERLAYS ================= */}

      {/* 1. PASSWORD GATE SETTINGS MODAL */}
      {showPasswordChangeModal && (
        <div id="modal-pwd-change" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-fade-in border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-bold text-slate-900 font-heading uppercase tracking-wide flex items-center space-x-1.5">
                <Key className="w-4 h-4 text-sky-600" />
                <span>Pengaturan Kata Sandi Admin</span>
              </h3>
              <button 
                onClick={() => setShowPasswordChangeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {pwdChangeSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-100">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-heading">Password Berhasil Diubah!</h4>
                <p className="text-[10px] text-slate-400">Kata sandi admin yang baru telah aktif dan tersimpan.</p>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <p className="text-[10px] text-slate-400 leading-normal mb-3 font-smooth">
                  Pastikan Anda mengingat kata sandi baru ini. Password awal adalah <strong className="text-slate-600">"ECI 2026"</strong>.
                </p>

                <div>
                  <label htmlFor="newPassword" className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1">Password Baru</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 focus:outline-none bg-slate-50/50"
                    placeholder="Masukkan sandi baru"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmNewPassword" className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1">Konfirmasi Password Baru</label>
                  <input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 focus:outline-none bg-slate-50/50"
                    placeholder="Ulangi sandi baru"
                    required
                  />
                </div>

                {pwdChangeError && (
                  <p className="text-[10px] text-rose-500 font-medium flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    {pwdChangeError}
                  </p>
                )}

                <div className="flex space-x-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowPasswordChangeModal(false)}
                    className="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-soft"
                  >
                    Simpan Sandi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. SUBMISSION INSPECTOR DIALOG (DOKUMEN DAN MEMBER CARD PREVIEW) */}
      {selectedRecord && (
        <div id="modal-record-inspector" className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-xl relative my-8 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 mb-4 shrink-0">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded uppercase leading-none">INSPEKTUR CERTIFICATE & CARD</span>
                <h3 className="text-xs font-bold text-slate-900 font-heading uppercase tracking-wide mt-1.5">Berkas : {selectedRecord.fullName}</h3>
              </div>
              <button 
                id="close-inspector-btn"
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg font-bold transition-all text-sm flex items-center space-x-1"
              >
                <span>Tutup Berkas</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Container containing SuccessView component elements */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="bg-slate-50/75 rounded-2xl border border-slate-200/50 p-4 min-h-[500px]">
                <SuccessView record={selectedRecord} onReset={() => {}} hideResetBtn={true} />
              </div>
            </div>

            {/* Bottom Footer block */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-end shrink-0">
              <button
                id="close-inspector-bottom-btn"
                onClick={() => setSelectedRecord(null)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold tracking-wide"
              >
                Selesai Memeriksa
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. CONFIRMATION DELETION DIALOG */}
      {recordToDelete && (
        <div id="modal-deletion-confirm" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-fade-in border border-slate-100 text-center">
            
            <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4 border border-rose-100">
              <Trash2 className="w-5 h-5" />
            </div>

            <h3 className="text-xs font-bold text-slate-900 font-heading uppercase tracking-wide">Hapus Data Pendaftaran?</h3>
            <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed font-smooth">
              Apakah Anda yakin ingin menghapus registrasi atas nama <strong className="text-slate-850">{recordToDelete.fullName}</strong> ({recordToDelete.id})? Tindakan ini <strong>tidak dapat dibatalkan</strong> dan akan menghapus data secara permanen dari tabel database Supabase.
            </p>

            <div className="flex space-x-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                id="cancel-delete-btn"
                onClick={() => setRecordToDelete(null)}
                className="flex-1 py-2 border border-slate-200 text-xs font-semibold text-slate-500 bg-white hover:bg-slate-50 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                id="confirm-delete-btn"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-soft"
              >
                Ya, Hapus Permanen
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
