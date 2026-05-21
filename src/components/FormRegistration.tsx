/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Calendar, ShieldCheck, Upload, Info, 
  ChevronRight, ChevronLeft, CheckCircle, Image as ImageIcon,
  Heart, Compass, HelpCircle, Briefcase, GraduationCap, X
} from 'lucide-react';
import { RegistrationForm } from '../types';

interface FormRegistrationProps {
  onSubmit: (data: RegistrationForm) => void;
}

export default function FormRegistration({ onSubmit }: FormRegistrationProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationForm>({
    fullName: '',
    birthDate: '',
    gender: '',
    status: '',
    interest: '',
    interestKnowledge: '',
    joinReason: '',
    profilePicture: '',
    agreement: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate age based on local year 2026 (as per additional metadata)
  const calculateAge = (birthDateString: string): number => {
    if (!birthDateString) return 0;
    const birthDate = new Date(birthDateString);
    const today = new Date('2026-05-21'); // Current time in system metadata is mid-2026
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Profile picture base64 conversion
  const processFile = (file: File) => {
    if (!file) return;
    
    // Check type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, profilePicture: 'File harus berformat gambar (.jpg, .png, .jpeg)' }));
      return;
    }
    
    // Check size (max 3MB for base64 storage)
    if (file.size > 3 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profilePicture: 'Ukuran gambar maksimal 3MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
      setErrors(prev => {
        const next = { ...prev };
        delete next['profilePicture'];
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, profilePicture: '' }));
  };

  // Validation functions per step
  const validateStep = (currentStep: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Nama lengkap wajib diisi';
      } else if (formData.fullName.trim().length < 3) {
        newErrors.fullName = 'Nama minimal memiliki 3 karakter';
      }

      if (!formData.birthDate) {
        newErrors.birthDate = 'Tanggal lahir wajib diisi';
      } else {
        const age = calculateAge(formData.birthDate);
        if (age < 14 || age > 40) {
          newErrors.birthDate = `Umur Anda ${age} tahun. Batas umur pendaftaran adalah 14 - 40 tahun.`;
        }
      }

      if (!formData.gender) {
        newErrors.gender = 'Silakan pilih gender Anda';
      }

      if (!formData.status) {
        newErrors.status = 'Silakan pilih status kesibukan Anda';
      }
    }

    if (currentStep === 2) {
      if (!formData.interest) {
        newErrors.interest = 'Silakan pilih bidang minat Anda';
      }

      if (!formData.interestKnowledge.trim()) {
        newErrors.interestKnowledge = 'Tuliskan sedikit penjelasan pengetahuan Anda terhadap minat terpilih';
      } else if (formData.interestKnowledge.trim().length < 15) {
        newErrors.interestKnowledge = 'Tuliskan minimal 15 karakter agar tim seleksi lebih memahaminya';
      }

      if (!formData.joinReason.trim()) {
        newErrors.joinReason = 'Wajib mencantumkan alasan Anda ingin bergabung';
      } else if (formData.joinReason.trim().length < 20) {
        newErrors.joinReason = 'Tuliskan alasan minimal 20 karakter secara jujur dan jelas';
      }
    }

    if (currentStep === 3) {
      if (!formData.profilePicture) {
        newErrors.profilePicture = 'Wajib mengunggah foto profil untuk Member Card';
      }

      if (!formData.agreement) {
        newErrors.agreement = 'Anda harus menyetujui kebijakan dan peraturan komunitas sebelum mendaftar';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(3)) {
      onSubmit(formData);
    }
  };

  // Helper lists
  const statusOptions = [
    { value: 'Pelajar', label: 'Pelajar (SMP/SMA/Sederajat)' },
    { value: 'Mahasiswa', label: 'Mahasiswa (D3/D4/S1/S2)' },
    { value: 'Bekerja', label: 'Bekerja / Profesional' },
    { value: 'Berkeluarga', label: 'Berkeluarga' },
    { value: 'Lainnya', label: 'Lainnya' }
  ];

  const interestOptions = [
    { value: 'Astronomi', label: '🌌 Astronomi & Ruang Angkasa' },
    { value: 'History/Sejarah', label: '📜 History / Sejarah Nusantara & Dunia' },
    { value: 'Teknologi informasi & Coding', label: '💻 Teknologi Informasi & Coding' },
    { value: 'Psikologi & Mental health', label: '🧠 Psikologi & Mental Health' },
    { value: 'Linguistik & Bahasa asing', label: '🗣️ Linguistik & Bahasa Asing' },
    { value: 'Sastra & Kepenulisan kreatif', label: '✍️ Sastra & Kepenulisan Kreatif' },
    { value: 'Fisika & Matematika murni', label: '🧮 Fisika & Matematika Murni' },
    { value: 'Desain grafis & Visual', label: '🎨 Desain Grafis & Visual' },
    { value: 'Lainnya', label: '🧩 Lainnya' }
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      
      {/* Dynamic Header */}
      <div className="text-center mb-10">
        <span className="text-[10px] tracking-[0.25em] text-sky-600 font-mono uppercase bg-sky-50 px-3 py-1.5 rounded-full font-medium">
          FORMULIR SELEKSI ECI
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-4 font-heading">
          Bergabung dengan Komunitas ECI
        </h2>
        <p className="text-[12px] text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
          Ungkapkan potensi terbaikmu dan kembangkan minat akademismu bersama ribuan pegiat edukasi di seluruh Indonesia.
        </p>

        {/* Custom Progress Stepper */}
        <div className="flex items-center justify-between max-w-xs mx-auto mt-10 relative">
          {/* Progress bar line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-100 -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-sky-500 transition-all duration-300 -z-10"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>

          {/* Steps pointers */}
          {[1, 2, 3].map((num) => (
            <button
              id={`step-indicator-${num}`}
              key={num}
              onClick={() => step > num && setStep(num)}
              disabled={step < num}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium font-mono transition-all duration-300 ${
                step === num 
                  ? 'bg-sky-600 text-white shadow-[0_0_0_4px_rgba(2,132,199,0.15)] scale-110' 
                  : step > num 
                    ? 'bg-sky-500 text-white cursor-pointer hover:bg-sky-600' 
                    : 'bg-white border border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {step > num ? '✓' : `0${num}`}
            </button>
          ))}
        </div>

        {/* Step label */}
        <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-3">
          {step === 1 && 'Langkah 1: Profil & Identitas'}
          {step === 2 && 'Langkah 2: Minat & Motivasi'}
          {step === 3 && 'Langkah 3: Unggah Foto & Selesai'}
        </div>
      </div>

      {/* Main Glassmorphic Form Card */}
      <div id="registration-form-container" className="glass-panel rounded-2xl p-6 sm:p-8 shadow-card border border-slate-100/80">
        <form onSubmit={handleSubmit} noValidate>
          <AnimatePresence mode="wait">

            {/* STEP 1: Profil & Identitas */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="border-b border-slate-100 pb-3 mb-5">
                  <h3 className="text-[13px] font-semibold text-slate-900 tracking-wide uppercase font-heading flex items-center space-x-2">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>Identitas Pendaftar</span>
                  </h3>
                  <p className="text-[10.5px] text-slate-400 mt-1">Lengkapi informasi biodata resmi Anda sesuai KTP atau kartu identitas.</p>
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label htmlFor="fullName" className="block text-[11px] font-medium tracking-wider text-slate-500 uppercase mb-1.5">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      placeholder="Masukkan nama lengkap Anda"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full text-xs font-smooth px-3.5 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none bg-slate-50/50 ${
                        errors.fullName 
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-100' 
                          : 'border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-100'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <motion.p initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 mt-1.5 flex items-center">
                      <span className="w-1 h-1 rounded-full bg-rose-500 mr-1.5 inline-block"></span>
                      {errors.fullName}
                    </motion.p>
                  )}
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="birthDate" className="block text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                      Tanggal Lahir <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[9.5px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">Umur: 14 - 40 Tahun</span>
                  </div>
                  <div className="relative">
                    <input
                      id="birthDate"
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className={`w-full text-xs font-smooth px-3.5 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none bg-slate-50/50 ${
                        errors.birthDate 
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-100' 
                          : 'border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-100'
                      }`}
                    />
                  </div>
                  {errors.birthDate && (
                    <motion.p initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 mt-1.5 flex items-center">
                      <span className="w-1 h-1 rounded-full bg-rose-500 mr-1.5 inline-block"></span>
                      {errors.birthDate}
                    </motion.p>
                  )}
                </div>

                {/* Gender & Status (2 Column grid on tablet/pc) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Gender */}
                  <div>
                    <label htmlFor="gender" className="block text-[11px] font-medium tracking-wider text-slate-500 uppercase mb-1.5">
                      Gender / Jenis Kelamin <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full text-xs font-smooth px-3.5 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none bg-slate-50/50 appearance-none cursor-pointer ${
                        errors.gender 
                          ? 'border-rose-400 focus:border-rose-500' 
                          : 'border-slate-200 focus:border-sky-500'
                      }`}
                    >
                      <option value="">Pilih Gender</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    {errors.gender && (
                      <motion.p initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 mt-1.5 flex items-center">
                        <span className="w-1 h-1 rounded-full bg-rose-500 mr-1.5 inline-block"></span>
                        {errors.gender}
                      </motion.p>
                    )}
                  </div>

                  {/* Kesibukan / Status */}
                  <div>
                    <label htmlFor="status" className="block text-[11px] font-medium tracking-wider text-slate-500 uppercase mb-1.5">
                      Status Kesibukan <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={`w-full text-xs font-smooth px-3.5 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none bg-slate-50/50 appearance-none cursor-pointer ${
                        errors.status 
                          ? 'border-rose-400 focus:border-rose-500' 
                          : 'border-slate-200 focus:border-sky-500'
                      }`}
                    >
                      <option value="">Pilih Kesibukan</option>
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {errors.status && (
                      <motion.p initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 mt-1.5 flex items-center">
                        <span className="w-1 h-1 rounded-full bg-rose-500 mr-1.5 inline-block"></span>
                        {errors.status}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Hint Informative */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-start space-x-2.5">
                  <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-[10px] text-slate-500 leading-normal font-smooth">
                    Semua data Anda dijamin kerahasiaannya oleh Komite Seleksi ECI dan hanya digunakan untuk keperluan verifikasi keanggotaan.
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Minat & Motivasi */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="border-b border-slate-100 pb-3 mb-5">
                  <h3 className="text-[13px] font-semibold text-slate-900 tracking-wide uppercase font-heading flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-sky-600" />
                    <span>Eksplorasi Minat & Motivasi</span>
                  </h3>
                  <p className="text-[10.5px] text-slate-400 mt-1">Kami ingin menempatkan Anda pada departemen belajar yang paling sesuai.</p>
                </div>

                {/* Minat */}
                <div>
                  <label htmlFor="interest" className="block text-[11px] font-medium tracking-wider text-slate-500 uppercase mb-1.5">
                    Bidang Minat Komunitas <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleInputChange}
                    className={`w-full text-xs font-smooth px-3.5 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none bg-slate-50/50 appearance-none cursor-pointer ${
                      errors.interest 
                        ? 'border-rose-400 focus:border-rose-500' 
                        : 'border-slate-200 focus:border-sky-500'
                    }`}
                  >
                    <option value="">Pilih Bidang Minat</option>
                    {interestOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.interest && (
                    <motion.p initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 mt-1.5 flex items-center">
                      <span className="w-1 h-1 rounded-full bg-rose-500 mr-1.5 inline-block"></span>
                      {errors.interest}
                    </motion.p>
                  )}
                </div>

                {/* Pengetahuan terhadap Minat */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="interestKnowledge" className="block text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                      Pengetahuan terhadap Minat Tersebut <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[9px] text-slate-400 font-mono">Min. 15 Karakter</span>
                  </div>
                  <textarea
                    id="interestKnowledge"
                    name="interestKnowledge"
                    rows={3}
                    placeholder="Contoh: Saya sudah mempelajari dasar logika pemrograman Web (HTML, CSS, JS) selama 6 bulan terakhir secara mandiri melalui modul..."
                    value={formData.interestKnowledge}
                    onChange={handleInputChange}
                    className={`w-full text-xs font-smooth px-3.5 py-3 rounded-lg border transition-all duration-200 focus:outline-none bg-slate-50/50 resize-y min-h-[80px] ${
                      errors.interestKnowledge 
                        ? 'border-rose-400 focus:border-rose-500' 
                        : 'border-slate-200 focus:border-sky-500'
                    }`}
                  ></textarea>
                  {errors.interestKnowledge && (
                    <motion.p initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 mt-1.5 flex items-center">
                      <span className="w-1 h-1 rounded-full bg-rose-500 mr-1.5 inline-block"></span>
                      {errors.interestKnowledge}
                    </motion.p>
                  )}
                </div>

                {/* Alasan Bergabung */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="joinReason" className="block text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                      Alasan Bergabung dengan ECI <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[9px] text-slate-400 font-mono">Min. 20 Karakter</span>
                  </div>
                  <textarea
                    id="joinReason"
                    name="joinReason"
                    rows={3.5}
                    placeholder="Mengapa Anda tertarik mendaftar? Apa yang Anda ingin peroleh dan kontribusikan ke ECI..."
                    value={formData.joinReason}
                    onChange={handleInputChange}
                    className={`w-full text-xs font-smooth px-3.5 py-3 rounded-lg border transition-all duration-200 focus:outline-none bg-slate-50/50 resize-y min-h-[90px] ${
                      errors.joinReason 
                        ? 'border-rose-400 focus:border-rose-500' 
                        : 'border-slate-200 focus:border-sky-500'
                    }`}
                  ></textarea>
                  {errors.joinReason && (
                    <motion.p initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 mt-1.5 flex items-center">
                      <span className="w-1 h-1 rounded-full bg-rose-500 mr-1.5 inline-block"></span>
                      {errors.joinReason}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Foto Profil & Konfirmasi */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="border-b border-slate-100 pb-3 mb-5">
                  <h3 className="text-[13px] font-semibold text-slate-900 tracking-wide uppercase font-heading flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>Foto Profil & Finalisasi</span>
                  </h3>
                  <p className="text-[10.5px] text-slate-400 mt-1">Unggah pasfoto formal/semi-formal terbaik Anda untuk dicetak pada kartu anggota.</p>
                </div>

                {/* Foto Profil Upload area */}
                <div>
                  <label className="block text-[11px] font-medium tracking-wider text-slate-500 uppercase mb-2">
                    Pasfoto Profil Keanggotaan <span className="text-rose-500">*</span>
                  </label>

                  {formData.profilePicture ? (
                    // Display uploaded image preview with remove trigger
                    <div className="flex flex-col items-center justify-center p-6 border border-slate-100 bg-slate-50/70 rounded-xl relative group">
                      <div className="relative w-28 h-28 rounded-full border-2 border-sky-450/40 p-1 bg-white overflow-hidden shadow-soft">
                        <img 
                          src={formData.profilePicture} 
                          alt="Profile Preview" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <button
                        id="remove-photo-btn"
                        type="button"
                        onClick={removePhoto}
                        className="mt-3.5 text-[10px] text-rose-500 hover:text-rose-600 font-medium font-mono border border-rose-100 hover:bg-rose-50 px-3 py-1.5 rounded-md transition-all duration-200 flex items-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Hapus & Ganti Foto</span>
                      </button>
                    </div>
                  ) : (
                    // File drop area
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
                        dragActive 
                          ? 'border-sky-500 bg-sky-50/40 scale-[1.01]' 
                          : errors.profilePicture 
                            ? 'border-rose-300 bg-rose-50/10 hover:border-rose-400' 
                            : 'border-slate-200 hover:border-sky-400 hover:bg-sky-50/10'
                      }`}
                    >
                      <input
                        id="profilePicture"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="w-11 h-11 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 mb-2.5">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-[11.5px] font-medium text-slate-700">Tarik gambar ke sini, atau klik untuk memilih file</p>
                      <p className="text-[9.5px] text-slate-400 mt-1">JPEG, PNG, atau JPG. Maksimal 3MB</p>
                    </div>
                  )}

                  {errors.profilePicture && (
                    <motion.p initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 mt-2 flex items-center justify-center">
                      <span className="w-1 h-1 rounded-full bg-rose-500 mr-1.5 inline-block"></span>
                      {errors.profilePicture}
                    </motion.p>
                  )}
                </div>

                {/* Perjanjian Centang / Agreement */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreement"
                        name="agreement"
                        type="checkbox"
                        checked={formData.agreement}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500 cursor-pointer"
                      />
                    </div>
                    <div className="ml-3 text-[10.5px]">
                      <label htmlFor="agreement" className="font-smooth text-slate-600 leading-relaxed cursor-pointer select-none">
                        Dengan ini saya setuju terhadap kebijakan, ketentuan pendaftaran, serta peraturan internal yang berlaku pada komunitas <strong className="text-slate-800">ECI (Education Community Indonesia)</strong>.
                      </label>
                      {errors.agreement && (
                        <motion.p initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 mt-1.5 flex items-center">
                          <span className="w-1 h-1 rounded-full bg-rose-500 mr-1.5 inline-block"></span>
                          {errors.agreement}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* BUTTON NAVIGATION GRID */}
            <div className="flex space-x-3.5 mt-8 pt-5 border-t border-slate-100">
              {step > 1 && (
                <button
                  id="prev-step-btn"
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-[11.5px] font-medium text-slate-600 bg-white hover:bg-slate-50 transition-all duration-200 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
              )}

              {step < 3 ? (
                <button
                  id="next-step-btn"
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[11.5px] font-medium transition-all duration-200 flex items-center justify-center space-x-1 cursor-pointer shadow-soft"
                >
                  <span>Lanjutkan</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="submit-form-btn"
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[11.5px] font-medium transition-all duration-200 flex items-center justify-center space-x-1 cursor-pointer shadow-soft"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit Pendaftaran</span>
                </button>
              )}
            </div>

          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
