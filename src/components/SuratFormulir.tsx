/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, FileText, Check, AlertCircle } from 'lucide-react';
import { RegistrationRecord } from '../types';

interface SuratFormulirProps {
  record: RegistrationRecord;
}

export default function SuratFormulir({ record }: SuratFormulirProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [scale, setScale] = useState(1);

  // Calculate dynamic scale factor based on parent width
  React.useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        if (containerWidth < 720) {
          setScale(containerWidth / 720);
        } else {
          setScale(1);
        }
      }
    };

    // Run initially & bind resize listener
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Quick timeout fallback in case of dynamic viewport setup lag
    const timer = setTimeout(handleResize, 150);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Function to download the printable sheet as a PNG image
  const [fallbackImage, setFallbackImage] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!paperRef.current) return;
    try {
      setDownloading(true);
      
      // Save current scale style properties
      const originalTransform = paperRef.current.style.transform;
      const originalTransformOrigin = paperRef.current.style.transformOrigin;
      const originalWidth = paperRef.current.style.width;
      const originalMinHeight = paperRef.current.style.minHeight;

      // Temporarily restore original size and remove transform scales for crisp high DPI render
      paperRef.current.style.transform = 'none';
      paperRef.current.style.transformOrigin = '';
      paperRef.current.style.width = '720px';
      paperRef.current.style.minHeight = '920px';

      // Calculate optimized scaling for beautiful resolution
      const canvas = await html2canvas(paperRef.current, {
        scale: 2, // High DPI rendering
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });

      // Restore scale transformations immediately after snapshotting
      paperRef.current.style.transform = originalTransform;
      paperRef.current.style.transformOrigin = originalTransformOrigin;
      paperRef.current.style.width = originalWidth;
      paperRef.current.style.minHeight = originalMinHeight;

      // Construct file link and trigger with blob instead of data URI for sandbox compliance
      canvas.toBlob((blob) => {
        if (!blob) {
          // Fallback to dataURL if blob fails
          const imgData = canvas.toDataURL('image/png');
          setFallbackImage(imgData);
          setDownloadSuccess(true);
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `Surat_Pendaftaran_ECI_${record.fullName.replace(/\s+/g, '_')}.png`;
        link.href = url;
        
        // Append to body temporarily for Firefox compatibility
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // High visibility fallback preview set
        const reader = new FileReader();
        reader.onloadend = () => {
          setFallbackImage(reader.result as string);
        };
        reader.readAsDataURL(blob);

        setDownloadSuccess(true);
        setTimeout(() => {
          URL.revokeObjectURL(url);
          setDownloadSuccess(false);
        }, 3000);
      }, 'image/png');

    } catch (err) {
      console.error('Error generating image download:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Interactive print wrapper */}
      <div 
        ref={containerRef}
        className="w-full overflow-hidden pb-4 flex justify-center"
        style={{ height: `${930 * scale}px` }}
      >
        {/* The formal letter paper container with dynamic dynamic scale transform */}
        <div 
          ref={paperRef}
          id="formal-letter-card" 
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out-back'
          }}
          className="w-[720px] min-h-[920px] bg-white p-12 text-slate-800 font-sans shadow-lg shadow-slate-100 border border-slate-200/60 shrink-0 select-none relative"
        >
          {/* Watermark of ECI (Subtle, professional) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
            <div className="w-96 h-96 rounded-full border-[20px] border-sky-900 flex items-center justify-center text-8xl font-bold font-mono tracking-tighter">
              ECI
            </div>
          </div>

          {/* Kop Surat / Letterhead */}
          <div className="flex items-center justify-between border-b-[2.5px] border-slate-900 pb-5 mb-6">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold font-heading text-lg">
                ECI
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-widest text-slate-900 uppercase font-heading leading-tight">
                  EDUCATION COMMUNITY INDONESIA
                </h1>
                <p className="text-[9.5px] text-slate-500 font-medium tracking-wide">
                  Yayasan Pembinaan dan Pemberdayaan Pendidikan Indonesia
                </p>
                <p className="text-[8px] text-slate-400 font-mono mt-0.5 uppercase">
                  Website: eci-community.or.id | Email: info@eci-community.or.id
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8.5px] tracking-wider text-slate-400 font-mono uppercase block">DOKUMEN RESMI</span>
              <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded font-mono border border-sky-100/30 inline-block mt-1">
                {record.id}
              </span>
            </div>
          </div>

          {/* Letter Title */}
          <div className="text-center my-6">
            <h2 className="text-[13px] font-bold tracking-widest text-slate-900 uppercase font-heading underline">
              SURAT BUKTI REGRISTRASI & FORMULIR SELEKSI
            </h2>
            <p className="text-[9.5px] text-slate-500 font-mono mt-1">
              Ref NO: ECI/SRT-REG/2026/05/{record.id.split('-').pop()}
            </p>
          </div>

          {/* Introduction Paragraph */}
          <p className="text-[11px] leading-relaxed text-slate-600 mb-6 font-smooth">
            Dengan ini, Dewan Pengurus Pusat <strong className="text-slate-800">Education Community Indonesia (ECI)</strong> menyatakan bahwa data pendaftar di bawah ini telah tercatat secara sah dan resmi pada basis data pendaftaran calon anggota baru. Dokumen ini menjadi bukti otentik kepesertaan tahap pemantapan minat dan seleksi awal administrasi.
          </p>

          {/* Table Data Personal */}
          <div className="mb-6">
            <h3 className="text-[10.5px] font-bold tracking-wider text-slate-800 uppercase mb-3.5 border-b border-dashed border-slate-200 pb-1.5 font-heading">
              I. IDENTITAS CALON ANGGOTA
            </h3>
            <div className="grid grid-cols-[140px_1fr] gap-y-3 text-[11px] font-smooth px-2">
              <span className="text-slate-500">Nama Lengkap</span>
              <span className="font-semibold text-slate-900 uppercase">: {record.fullName}</span>

              <span className="text-slate-500">Tanggal Lahir</span>
              <span>: {new Date(record.birthDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>

              <span className="text-slate-500">Gender / Jenis Kelamin</span>
              <span>: {record.gender}</span>

              <span className="text-slate-500">Status Aktivitas</span>
              <span>: {record.status}</span>
            </div>
          </div>

          {/* Table Data Interests */}
          <div className="mb-6">
            <h3 className="text-[10.5px] font-bold tracking-wider text-slate-800 uppercase mb-3.5 border-b border-dashed border-slate-200 pb-1.5 font-heading">
              II. DEPARTEMEN & MINAT AKADEMIS
            </h3>
            <div className="grid grid-cols-[140px_1fr] gap-y-3 text-[11px] font-smooth px-2">
              <span className="text-slate-500">Bidang Minat Pilihan</span>
              <span className="font-semibold text-sky-700">: {record.interest}</span>

              <span className="text-slate-500 block self-start">Pengetahuan Minat</span>
              <span className="leading-relaxed text-slate-700 italic border-l-2 border-slate-100 pl-2 text-justify mr-2">
                : "{record.interestKnowledge}"
              </span>

              <span className="text-slate-500 block self-start">Alasan Bergabung</span>
              <span className="leading-relaxed text-slate-700 italic border-l-2 border-slate-100 pl-2 text-justify mr-2">
                : "{record.joinReason}"
              </span>
            </div>
          </div>

          {/* Statement Confirmation */}
          <div className="mb-10 bg-slate-50 p-4 border border-slate-100 rounded-lg">
            <p className="text-[10px] leading-relaxed text-slate-500 font-smooth italic">
              "Dengan ini saya setuju terhadap kebijakan dan peraturan yang berlaku. Seluruh data yang diisikan di atas adalah benar dan dapat dipertanggungjawabkan di kemudian hari apabila ditemukan penyimpangan."
            </p>
            <div className="flex items-center space-x-1.5 mt-2.5">
              <div className="w-3.5 h-3.5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3px]" />
              </div>
              <span className="text-[9.5px] text-emerald-700 font-mono font-medium lowercase">TERKONFIRMASI SECARA ELEKTRONIK - YA</span>
            </div>
          </div>

          {/* Interactive sign off layouts */}
          <div className="grid grid-cols-2 gap-8 text-[11px] mt-12 px-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-slate-400 font-mono text-[9.5px] mb-8">Pendaftar Yang Bersangkutan,</p>
              <div className="h-10"></div> {/* Blank separator for visual signing */}
              <p className="font-bold text-slate-800 uppercase underline">{record.fullName}</p>
              <p className="text-[9px] text-slate-400 font-mono">Calon Anggota ECI</p>
            </div>
            
            <div className="text-right">
              <p className="text-slate-400 font-mono text-[9.5px]">Jakarta, {record.registrationDate}</p>
              <p className="text-slate-500 font-medium text-[9.5px] mb-8">Hormat kami, DPP ECI</p>
              
              {/* Virtual stamp of DPP ECI */}
              <div className="relative inline-block h-10 w-32">
                {/* Vintage stamp graphics mockup */}
                <span className="absolute right-2 -top-5 opacity-85 text-[9px] border-2 border-dashed border-sky-600 text-sky-600 rounded px-2.5 py-1 rotate-[-8deg] font-bold tracking-widest bg-white/90">
                  APPROVED DPP ECI
                </span>
                <span className="font-mono text-slate-400 text-[8.5px] block absolute right-4 bottom-0">Tanda Tangan Digital</span>
              </div>

              <p className="font-bold text-slate-900 uppercase">M. Fadhil Rahman</p>
              <p className="text-[9px] text-slate-400 font-mono">Ketua Umum ECI Pusat</p>
            </div>
          </div>

          {/* Footer warning */}
          <div className="absolute bottom-8 left-12 right-12 text-center border-t border-slate-100 pt-3">
            <span className="text-[9px] tracking-wide text-slate-400 font-mono flex items-center justify-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
              <span>Harap bawa formulir sheet dan member card ini untuk dikirimkan ke grup seleksi WhatsApp.</span>
            </span>
          </div>

        </div>
      </div>

      {/* Download trigger */}
      <div className="flex flex-col items-center mt-4">
        <button
          id="download-letter-btn"
          onClick={handleDownload}
          disabled={downloading}
          className={`px-5 py-2.5 rounded-lg text-[11.5px] font-medium transition-all duration-300 flex items-center space-x-2 shadow-soft border ${
            downloadSuccess 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer'
          }`}
        >
          <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
          <span>{downloading ? 'Mengekspor Surat...' : 'Download Surat Formulir (PNG)'}</span>
        </button>

        {fallbackImage && (
          <p className="text-[10px] text-slate-400 mt-2 text-center max-w-xs">
            Jika unduhan otomatis diblokir, silakan klik tombol di bawah untuk melihat gambar dan menyimpannya secara manual.
          </p>
        )}

        {fallbackImage && (
          <button
            id="view-rendered-letter-btn"
            onClick={() => {}}
            className="mt-2 text-[10.5px] font-mono text-sky-600 hover:underline bg-sky-50 px-3 py-1.5 rounded-md"
            style={{ display: 'none' }} /* Trigger is replaced by persistent help overlay below for max foolproofness */
          />
        )}
      </div>

      {/* Fallback Image Backdrop Modal (Absolutely foolproof for any sandbox browser) */}
      {fallbackImage && (
        <div id="modal-letter-fallback" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 font-heading tracking-wide uppercase">DOKUMEN SIAP DISIMPAN</h3>
                <p className="text-[10px] text-slate-400 font-smooth mt-0.5">Ketuk lama pada gambar (di HP) atau klik kanan kemudian pilih "Simpan Gambar" (di komputer).</p>
              </div>
              <button 
                id="close-fallback-letter-modal-btn"
                onClick={() => setFallbackImage(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors font-semibold"
              >
                Tutup
              </button>
            </div>

            <div className="border border-slate-150 rounded-xl overflow-hidden bg-slate-50 flex justify-center max-h-[60vh] overflow-y-auto">
              <img 
                src={fallbackImage} 
                alt="Bukti Formulir" 
                className="w-full h-auto object-contain select-text"
              />
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 text-center">
              <button
                id="close-fallback-letter-modal-bottom-btn"
                onClick={() => setFallbackImage(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold tracking-wide transition-all duration-200"
              >
                Selesai / Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
