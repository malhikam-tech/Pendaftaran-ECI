/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, Search, ArrowLeft, BookOpen, Scale, 
  HelpCircle, AlertTriangle, CheckSquare, Sparkles, Copy, Check,
  Users, MessageSquare, ShieldAlert, Award, Video, Compass, ChevronRight, Zap
} from 'lucide-react';

interface RulesEciProps {
  onBack: () => void;
}

export default function RulesEci({ onBack }: RulesEciProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'member' | 'leader' | 'sanksi'>('all');

  // Interactive WA Community Structure Visualizer Data
  const waGroupCategories = [
    {
      name: "Grup Utama (Ecosystem Core)",
      description: "Pusat informasi satu arah & pengumuman krusial dari Pemimpin Pusat.",
      icon: <Award className="w-4 h-4 text-amber-500" />
    },
    {
      name: "8 Grup Jurusan (Spesifik Minat)",
      description: "Wadah diskusi akademik spesifik dipimpin oleh Komandan Jurusan.",
      icon: <Users className="w-4 h-4 text-indigo-500" />
    },
    {
      name: "Grup Seleksi",
      description: "Gerbang penyaringan calon anggota baru untuk penugasan awal.",
      icon: <Compass className="w-4 h-4 text-sky-500" />
    },
    {
      name: "Grup Ngobrol Santai",
      description: "Batu loncatan bonding & interaksi kasual antar seluruh divisi.",
      icon: <MessageSquare className="w-4 h-4 text-emerald-500" />
    }
  ];

  // Community Rules Data using exact stylized unicode requested with correct ECI organizational workflow
  const rulesData = [
    {
      category: "❊ 𝐔𝐌𝐔𝐌 (𝐆𝐄𝐍𝐄𝐑𝐀𝐋 𝐄𝐂𝐎𝐒𝐘𝐒𝐓𝐄𝐌)",
      tab: "member",
      icon: <Scale className="w-4 h-4 text-sky-600" />,
      articles: [
        {
          pasal: "-𝗣𝗮𝘀𝗮𝗹 𝟭 (Sistem Whatsapp & TikTok)",
          ayats: [
            {
              num: "𝗔𝘆𝗮𝘁 𝟭",
              text: "𝘌𝘊𝘐 𝘮𝘦𝘯𝘨𝘰𝘱𝘦𝘳𝘢𝘴𝘪𝘬𝘢𝘯 𝘴𝘪𝘴𝘵𝘦𝘮 𝘴𝘢𝘵𝘶 𝘒𝘰𝘮𝘶𝘯𝘪𝘵𝘢𝘴 𝘞𝘩𝘢𝘵𝘴𝘈𝘱𝘱 𝘛𝘦𝘳𝘱𝘢𝘥𝘶 𝘺𝘢𝘯𝘨 𝘵𝘦𝘳𝘥𝘪𝘳𝘪 𝘥𝘢𝘳𝘪 8 𝘎𝘳𝘶𝘱 𝘑𝘶𝘳𝘶𝘴𝘢𝘯 (𝘮𝘪𝘯𝘢𝘵), 𝘎𝘳𝘶𝘱 𝘜𝘵𝘢𝘮𝘢, 𝘎𝘳𝘶𝘱 𝘕𝘨𝘰𝘣𝘳𝘰𝘭 𝘚𝘢𝘯𝘵𝘢𝘪, 𝘥𝘢𝘯 𝘎𝘳𝘶𝘱 𝘚𝘦𝘭𝘦𝘬𝘴𝘪."
            },
            {
              num: "𝗔𝘆𝗮𝘁 𝟮",
              text: "𝘚𝘦𝘭𝘶𝘳𝘶𝘩 𝘢𝘯𝘨𝘨𝘰𝘵𝘢 𝘌𝘊𝘐 𝘸𝘢𝘫𝘪𝘣 𝘣𝘦𝘳𝘱𝘢𝘳𝘵𝘪𝘴𝘪𝘱𝘢𝘴𝘪 𝘢𝘬𝘵𝘪𝘧 𝘮𝘦𝘮𝘣𝘶𝘢𝘵 𝘥𝘢𝘯 𝘮𝘦𝘯𝘺𝘦𝘣𝘢𝘳𝘬𝘢𝘯 𝘬𝘰𝘯𝘵𝘦𝘯-𝘬𝘰𝘯𝘵𝘦𝘯 𝘦𝘥𝘶𝘬𝘢𝘴𝘪 𝘺𝘢𝘯𝘨 𝘮𝘦𝘯𝘢𝘳𝘪𝘬 𝘥𝘪 𝘱𝘭𝘢𝘵𝘧𝘰𝘳𝘮 𝘛𝘪𝘒𝘵𝘰𝘬 𝘴𝘦𝘣𝘢𝘨𝘢𝘪 𝘣𝘶𝘬𝘵𝘪 𝘬𝘰𝘯𝘵𝘳𝘪𝘣𝘶𝘴𝘪 𝘥𝘪𝘨𝘪𝘵𝘢𝘭."
            }
          ]
        },
        {
          pasal: "-𝗣𝗮𝘀𝗮𝗹 𝟮 (Sistem Komando Semi-Sentralisasi)",
          ayats: [
            {
              num: "𝗔𝘆𝗮𝘁 𝟭",
              text: "𝘌𝘊𝘐 𝘮𝘦𝘯𝘨𝘨𝘶𝘯𝘢𝘬𝘢𝘯 𝘴𝘪𝘴𝘵𝘦𝘮 𝘚𝘦𝘮𝘪-𝘚𝘦𝘯𝘵𝘳𝘢𝘭𝘪𝘴𝘢𝘴𝘪, 𝘥𝘪 𝘮𝘢𝘯𝘢 𝘴𝘦𝘵𝘪𝘢𝘱 𝘫𝘶𝘳𝘶𝘴𝘢𝘯 (𝘨𝘳𝘶𝘱 𝘤𝘩𝘢𝘵) 𝘮𝘦𝘮𝘪𝘭𝘪𝘬𝘪 𝘒𝘰𝘮𝘢𝘯𝘥𝘢𝘯 𝘑𝘶𝘳𝘶𝘴𝘢𝘯 𝘴𝘦𝘣𝘢𝘨𝘢𝘪 pemegang 𝘬𝘰𝘮𝘢𝘯𝘥𝘰 𝘵𝘦𝘳𝘵𝘪𝘯𝘨𝘨𝘪 𝘭𝘰𝘬𝘢𝘭."
            },
            {
              num: "𝗔𝘆𝗮𝘁 𝟮",
              text: "𝘚𝘦𝘭𝘶𝘳𝘶𝘩 𝘒𝘰𝘮𝘢𝘯𝘥𝘢𝘯 𝘑𝘶𝘳𝘶𝘴𝘢𝘯 𝘸𝘢𝘫𝘪𝘣 𝘵𝘦𝘵𝘢𝘱 𝘵𝘶𝘯𝘥𝘶𝘬, 𝘣𝘦𝘳𝘬𝘰𝘰𝘳𝘥𝘪𝘯𝘢𝘴𝘪, 𝘥𝘢𝘯 𝘣𝘦𝘳𝘫𝘢𝘭𝘢𝘯 𝘥𝘪 𝘣𝘢𝘸𝘢𝘩 𝘢𝘳𝘢𝘩𝘢𝘯 𝘗𝘦𝘮𝘪𝘱𝘪𝘯 𝘗𝘶𝘴𝘢𝘵 ECI."
            }
          ]
        }
      ]
    },
    {
      category: "❊ 𝐀𝐓𝐔𝐑𝐀𝐍 𝐌𝐄𝐌𝐁𝐄𝐑 (𝐌𝐄𝐌𝐁𝐄𝐑 𝐑𝐔𝐋𝐄𝐒)",
      tab: "member",
      icon: <Users className="w-4 h-4 text-indigo-600" />,
      articles: [
        {
          pasal: "-𝗣𝗮𝘀𝗮𝗹 𝟯 (Etika & Kebiasaan Chat)",
          ayats: [
            {
              num: "𝗔𝘆𝗮𝘁 𝟭",
              text: "𝘋𝘪𝘭𝘢𝘳𝘢𝘯𝘨 𝘵𝘰𝘹𝘪𝘤, 𝘣𝘦𝘳𝘱𝘦𝘳𝘪𝘭𝘢𝘬𝘶 𝘬𝘢𝘴𝘢𝘳, 𝘮𝘦𝘭𝘢𝘬𝘶𝘬𝘢𝘯 𝘱𝘦𝘳𝘶𝘯𝘥𝘶𝘯𝘨𝘢𝘯 (𝘣𝘶𝘭𝘭𝘺𝘪𝘯𝘨), 𝘴𝘦𝘳𝘵𝘢 𝘮𝘦𝘯𝘺𝘦𝘣𝘢𝘳𝘬𝘢𝘯 S𝘈𝘙𝘈 𝘥𝘢𝘯 𝘱𝘰𝘳𝘯𝘰𝘨𝘳𝘢𝘧𝘪 𝘥𝘪 𝘴𝘦𝘭𝘶𝘳𝘶𝘩 𝘨𝘳𝘶𝘱 𝘞𝘩𝘢𝘵𝘴𝘈𝘱𝘱 ECI."
            },
            {
              num: "𝗔𝘆𝗮𝘁 𝟮",
              text: "𝘠𝘢𝘯𝘨 𝘮𝘦𝘭𝘢𝘯𝘨𝘨𝘢𝘳 𝘢𝘬𝘢𝘯 𝘭𝘢𝘯𝘨𝘴𝘶𝘯𝘨  𝘥𝘪𝘱𝘳𝘰𝘴𝘦𝘴 𝘮𝘦𝘭𝘢𝘭𝘶𝘪 𝘴𝘪𝘴𝘵𝘦𝘮 𝘚𝘗 (𝘚𝘶𝘳𝘢𝘵 𝘗𝘦𝘳𝘪𝘯𝘨𝘢𝘵𝘢𝘯) 𝘰𝘭𝘦𝘩 𝘬𝘰𝘮𝘢𝘯𝘥𝘢𝘯 𝘫𝘶𝘳𝘶𝘴𝘢𝘯 𝘮𝘢𝘴𝘪𝘯𝘨-𝘮𝘢𝘴𝘪𝘯𝘨."
            }
          ]
        },
        {
          pasal: "-𝗣𝗮𝘀𝗮𝗹 𝟰 (Spamming & Aturan Konten TikTok)",
          ayats: [
            {
              num: "𝗔𝘆𝗮𝘁 𝟭",
              text: "𝘋𝘪𝘭𝘢𝘳𝘢𝘯𝘨 𝘮𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘬𝘢𝘯 link 𝘱𝘳𝘰𝘮𝘰𝘴𝘪 𝘵𝘢𝘯𝘱𝘢 𝘪𝘻𝘪𝘯, 𝘴𝘱𝘢𝘮 𝘱𝘦𝘴𝘢𝘯 𝘣𝘦𝘳𝘶𝘭𝘢𝘯𝘨, 𝘢𝘵𝘢𝘶 O𝘖𝘛 (𝘖𝘶𝘵 𝘰𝘧 𝘛𝘰𝘱𝘪𝘤) 𝘺𝘢𝘯𝘨 𝘣𝘦𝘳𝘭𝘦𝘣𝘪𝘩𝘢𝘯 𝘥𝘪 𝘨𝘳𝘶𝘱-𝘨𝘳𝘶𝘱 𝘢𝘬𝘢𝘥𝘦𝘮𝘪𝘴."
            },
            {
              num: "𝗔𝘆𝗮𝘁 𝟮",
              text: "𝘚𝘦𝘵𝘪𝘢𝘱 𝘬𝘰𝘯𝘵𝘦𝘯 𝘛𝘪𝘬𝘛𝘰𝘬 𝘺𝘢𝘯𝘨 𝘥𝘪𝘱𝘶𝘣𝘭𝘪𝘬𝘢𝘴𝘪𝘬𝘢𝘯 𝘸𝘢𝘫𝘪𝘣 𝘮𝘦𝘯𝘫𝘢𝘨𝘢 𝘯𝘪𝘭𝘢𝘪-𝘯𝘪𝘭𝘢𝘪 𝘦𝘥𝘶𝘬𝘢𝘵𝘪𝘧 𝘥𝘢𝘯 𝘮𝘦𝘯𝘤𝘢𝘯𝘵𝘶𝘮𝘬𝘢𝘯 𝘪𝘥𝘦𝘯𝘵𝘪𝘵𝘢𝘴 𝘌𝘊𝘐 𝘴𝘦𝘤𝘢𝘳𝘢 𝘱𝘳𝘰𝘧𝘦𝘴𝘪𝘰𝘯𝘢𝘭."
            }
          ]
        }
      ]
    },
    {
      category: "❊ 𝐀𝐓𝐔𝐑𝐀𝐍 𝐊𝐎𝐌𝐀𝐍𝐃𝐀𝐍 & 𝐏𝐄𝐓𝐈𝐍𝐆𝐆𝐈 (𝐋𝐄𝐀𝐃𝐄𝐑𝐒𝐇𝐈𝐏 𝐌𝐀𝐍𝐔𝐀𝐋)",
      tab: "leader",
      icon: <ShieldAlert className="w-4 h-4 text-emerald-600" />,
      articles: [
        {
          pasal: "-𝗣𝗮𝘀𝗮𝗹 𝟱 (Wewenang Komandan Jurusan)",
          ayats: [
            {
              num: "𝗔𝘆𝗮𝘁 𝟭",
              text: "𝘒𝘰𝘮𝘢𝘯𝘥𝘢𝘯 𝘑𝘶𝘳𝘶𝘴𝘢𝘯 𝘣𝘦𝘳𝘵𝘢𝘯𝘨𝘨𝘶𝘯𝘨 𝘫𝘢𝘸𝘢𝘣 𝘱𝘦𝘯𝘶𝘩 𝘢𝘵𝘢𝘴 𝘮𝘦𝘭𝘰𝘯𝘫𝘢𝘬𝘯𝘺𝘢 𝘱𝘢𝘳𝘵𝘪𝘴𝘪𝘱𝘢𝘴𝘪 𝘣𝘦𝘭𝘢𝘫𝘢𝘳 𝘥𝘢𝘯 𝘫𝘶𝘨𝘢 𝘬𝘦𝘵𝘦𝘳𝘵𝘪𝘣𝘢𝘯 𝘥𝘪 𝘥𝘢𝘭𝘢𝘮 𝘨𝘳𝘶𝘱 𝘫𝘶𝘳𝘶𝘴𝘢𝘯 𝘺𝘢𝘯𝘨 𝘥𝘪𝘱𝘪𝘮𝘱𝘪𝘯."
            },
            {
              num: "𝗔𝘆𝗮𝘁 𝟮",
              text: "𝘒𝘰𝘮𝘢𝘯𝘥𝘢𝘯 𝘣𝘦𝘳𝘩𝘢𝘬 𝘮𝘦𝘯𝘦𝘨𝘶𝘳, 𝘮𝘦𝘯𝘶𝘯𝘴𝘦𝘭, 𝘥𝘢𝘯 𝘮𝘦𝘯𝘨𝘢𝘫𝘶𝘬𝘢𝘯 𝘳𝘦𝘬𝘰𝘮𝘦𝘯𝘥𝘢𝘴𝘪 𝘚𝘗 𝘬𝘦𝘱𝘢𝘥𝘢 𝘱𝘪𝘮𝘱𝘪𝘯𝘢𝘯 𝘱𝘶𝘴𝘢𝘵 𝘫𝘪𝘬𝘢 𝘢𝘥𝘢 𝘢𝘯𝘨𝘨𝘰𝘵𝘢 𝘺𝘢𝘯𝘨 𝘪𝘯𝘴𝘶𝘣𝘰𝘳𝘥𝘪𝘯𝘢𝘵."
            }
          ]
        },
        {
          pasal: "-𝗣𝗮𝘀𝗮𝗹 𝟲 (Alur Kepatuhan Petinggi Pusat)",
          ayats: [
            {
              num: "𝗔𝘆𝗮𝘁 𝟭",
              text: "𝘚𝘦𝘵𝘪𝘢𝘱 𝘬𝘦𝘱𝘶𝘵𝘶𝘴𝘢𝘯 𝘭𝘰𝘬𝘢𝘭 𝘺𝘢𝘯𝘨 𝘥𝘪𝘢𝘮𝘣𝘪𝘭 𝘰𝘭𝘦𝘩 𝘒𝘰𝘮𝘢𝘯𝘥𝘢𝘯 𝘑𝘶𝘳𝘶𝘴𝘢𝘯 𝘸𝘢𝘫𝘪𝘣 𝘴𝘦𝘭𝘢𝘳𝘢𝘴 𝘥𝘦𝘯𝘨𝘢𝘯 𝘷𝘪𝘴𝘪 𝘮𝘪𝘴𝘪 𝘥𝘢𝘯 𝘬𝘦𝘵𝘦𝘯𝘵𝘶𝘢𝘯 𝘺𝘢𝘯𝘨 𝘥𝘪𝘵𝘦𝘵𝘢𝘱𝘬𝘢𝘯 𝘰𝘭𝘦𝘩 𝘗𝘦𝘮𝘪𝘱𝘪𝘯 𝘗𝘶𝘴𝘢𝘵."
            },
            {
              num: "𝗔𝘆𝗮𝘁 𝟮",
              text: "𝘗𝘦𝘮𝘪𝘱𝘪𝘯 𝘗𝘶𝘴𝘢𝘵 𝘣𝘦𝘳𝘩𝘢𝘬 𝘮𝘦𝘭𝘢𝘬𝘶𝘬𝘢𝘯 𝘷𝘦𝘵𝘰 atau 𝘱𝘦𝘯𝘺𝘦𝘨𝘢𝘳𝘢𝘯 𝘒𝘰𝘮𝘢𝘯𝘥𝘢𝘯 𝘑𝘶𝘳𝘶𝘴𝘢𝘯 𝘫𝘪𝘬𝘢 𝘵𝘦𝘳𝘫𝘢𝘥𝘪 𝘭𝘢𝘱𝘴𝘦-𝘰𝘧-𝘥𝘶𝘵𝘺 𝘢𝘵𝘢𝘶 tindakan 𝘵𝘪𝘥𝘢𝘬 𝘱𝘳𝘰𝘧𝘦𝘴𝘪𝘰𝘯𝘢𝘭."
            }
          ]
        }
      ]
    },
    {
      category: "❊ 𝐒𝐈𝐒𝐓𝐄𝐌 𝐒𝐀𝐍𝐊𝐒𝐈 & 𝐒𝐏 (𝐏𝐄𝐍𝐀𝐋𝐓𝐘 𝐆𝐔𝐈𝐃𝐄𝐋𝐈𝐍𝐄)",
      tab: "sanksi",
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      articles: [
        {
          pasal: "-𝗣𝗮𝘀𝗮𝗹 𝟳 (Alur Surat Peringatan / SP)",
          ayats: [
            {
              num: "𝗔𝘆𝗮𝘁 𝟭 (𝗦𝗣 𝟭 - Teguran Tertulis)",
              text: "𝘋𝘪𝘣𝘦𝘳𝘪𝘬𝘢𝘯 𝘬𝘦𝘱𝘢𝘥𝘢 𝘢𝘯𝘨𝘨𝘰𝘵𝘢 𝘺𝘢𝘯𝘨 𝘮𝘦𝘭𝘢𝘬𝘶𝘬𝘢𝘯 𝘱𝘦𝘭𝘢𝘯𝘨𝘨𝘢𝘳𝘢𝘯 𝘳𝘪𝘯𝘨𝘢𝘯 (𝘴𝘱𝘢𝘮𝘮𝘪𝘯𝘨, 𝘚𝘢𝘭𝘢𝘩 𝘒𝘢𝘮𝘢𝘳 𝘤𝘩𝘢𝘵 𝘣𝘦𝘳𝘶𝘭𝘢𝘯𝘨, 𝘰𝘰𝘵 𝘣𝘦𝘳𝘭𝘦𝘣𝘪𝘩𝘢𝘯) 𝘴𝘦𝘣𝘢𝘨𝘢𝘪 𝘱𝘦𝘳𝘪𝘯𝘨𝘢𝘵𝘢𝘯 𝘢𝘸𝘢𝘭 3 𝘩𝘢𝘳𝘪 𝘮𝘢𝘴𝘢 𝘱𝘦𝘯𝘵𝘢𝘶𝘢𝘯."
            },
            {
              num: "𝗔𝘆𝗮𝘁 𝟮 (𝗦𝗣 𝟮 - Pembatasan Akses)",
              text: "𝘋𝘪𝘣𝘦𝘳𝘪𝘬𝘢𝘯 𝘫𝘪𝘬𝘢 𝘢𝘯𝘨𝘨𝘰𝘵𝘢 𝘮𝘦𝘯𝘨𝘶𝘭𝘢𝘯𝘨𝘪 𝘱𝘦𝘭𝘢𝘯𝘨𝘨𝘢𝘳𝘢𝘯, 𝘢𝘵𝘢𝘶 𝘵𝘪𝘥𝘢𝘬 𝘬𝘰𝘯𝘵𝘳𝘪𝘣𝘶𝘵𝘪𝘧 𝘥𝘢𝘭𝘢𝘮 𝘵𝘶𝘨𝘢𝘴/𝘬𝘰𝘯𝘵𝘦𝘯 𝘛𝘪𝘬𝘛𝘰𝘬. 𝘚𝘢𝘯𝘬𝘴𝘪 𝘣𝘦𝘳𝘶𝘱𝘢 '𝘔𝘶𝘵𝘦' 𝘴𝘦𝘭𝘢𝘮𝘢 2 𝘹 24 𝘫𝘢𝘮 𝘥𝘢𝘳𝘪 seluruh 𝘨𝘳𝘶𝘱 𝘑𝘶𝘳𝘶𝘴𝘢𝘯."
            },
            {
              num: "𝗔𝘆𝗮𝘁 𝟯 (𝗦𝗣 𝟯 - Kicked & Ban Resmi)",
              text: "𝘛𝘪𝘯𝘥𝘢𝘬𝘢𝘯 𝘵𝘰𝘹𝘪𝘤 𝘣𝘦𝘳𝘢𝘵, 𝘱𝘦𝘯𝘤𝘦𝘮𝘢𝘳𝘢𝘯 𝘯𝘢𝘮𝘢 𝘣𝘢𝘪𝘬 𝘌𝘊𝘐, 𝘢𝘵𝘢𝘶 𝘱𝘦𝘭𝘢𝘯𝘨𝘨𝘢𝘳𝘢𝘯 𝘚𝘗 2. S𝘢𝘯𝘬𝘴𝘪 𝘣𝘦𝘳𝘶𝘱𝘢 𝘱𝘦𝘮𝘦𝘤𝘢𝘵𝘢𝘯 𝘴𝘦𝘤𝘢𝘳𝘢 𝘵𝘪𝘥𝘢𝘬 𝘩𝘰𝘳𝘮𝘢𝘵 (𝘒𝘪𝘤𝘬 𝘥𝘢𝘳𝘪 𝘒𝘰𝘮𝘶𝘯𝘪𝘵𝘢𝘴 𝘞𝘈 𝘥𝘢𝘯 𝘣𝘭𝘢𝘤𝘬𝘭𝘪𝘴𝘵 𝘯𝘰𝘮𝘰𝘳)."
            }
          ]
        }
      ]
    }
  ];

  const handleCopyRules = () => {
    let rulesText = "=== EDUCATION COMMUNITY INDONESIA (ECI) OFFICIAL SYSTEM RULES ===\n\n";
    rulesData.forEach(cat => {
      rulesText += `${cat.category}\n`;
      cat.articles.forEach(art => {
        rulesText += `  ${art.pasal}\n`;
        art.ayats.forEach(ay => {
          rulesText += `    ${ay.num} : ${ay.text}\n`;
        });
      });
      rulesText += "\n";
    });
    
    navigator.clipboard.writeText(rulesText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Filter based on search query and active tab
  const filteredRules = rulesData.map(cat => {
    // If activeTab is mismatch, skip
    if (activeTab !== 'all' && cat.tab !== activeTab && activeTab !== 'sanksi') {
      if (activeTab === 'sanksi' && cat.tab !== 'sanksi') {
        return { ...cat, articles: [] };
      }
      if (activeTab === 'leader' && cat.tab !== 'leader') {
        return { ...cat, articles: [] };
      }
      if (activeTab === 'member' && cat.tab !== 'member') {
        return { ...cat, articles: [] };
      }
    }

    const matchedArticles = cat.articles.filter(art => {
      const matchPasal = art.pasal.toLowerCase().includes(searchQuery.toLowerCase());
      const matchAyat = art.ayats.some(ay => 
        ay.num.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ay.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return matchPasal || matchAyat;
    });

    return {
      ...cat,
      articles: matchedArticles
    };
  }).filter(cat => cat.articles.length > 0);

  return (
    <div className="w-full flex-1 flex flex-col justify-start relative max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4">
      
      {/* Upper Navigation & Branding Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
        <div className="flex items-center space-x-3">
          <button
            id="rules-back-btn"
            onClick={onBack}
            className="p-2 border border-slate-200 hover:bg-slate-50 bg-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[9.5px] font-mono tracking-wider font-extrabold uppercase bg-sky-50 text-sky-700 px-2 py-0.5 rounded">
                COMMUNITY CONSTITUTION
              </span>
              <span className="text-[9.5px] font-mono tracking-wider font-extrabold uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-500 mr-0.5" />
                <span>ECI BANREK 2026/2027</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 tracking-tight mt-1">Sistem Rules & Regulasi WhatsApp & TikTok ECI</h2>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            id="copy-rules-clipboard-btn"
            onClick={handleCopyRules}
            className="px-3.5 py-2 text-[10.5px] font-semibold text-sky-750 hover:text-sky-850 bg-sky-50 border border-sky-100 hover:bg-sky-100 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Tersalin' : 'Salin Aturan ECI'}</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Community Ecosystem Infographic Widget */}
      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 sm:p-5 mb-6">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Arsitektur Ekosistem Digital ECI</span>
        </h3>
        
        {/* Branching flowchart */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {waGroupCategories.map((group, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-soft flex flex-col justify-between">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                  {group.icon}
                </div>
                <div>
                  <h4 className="text-[11.5px] font-bold text-slate-900 leading-tight">
                    {group.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    {group.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between text-[8px] font-mono font-bold text-slate-400">
                <span>WhatsApp Community</span>
                <span className="text-[9px] text-sky-600">✓ Aktif</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3 bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-3 text-[11px] text-indigo-900">
          <Video className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Divisi Kreator TikTok ECI:</span> Setiap member didorong untuk memproduksi konten edukasi kreatif di TikTok demi memperluas literasi digital. Karya terpilih akan dipajang di jajaran portofolio resmi ECI!
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-1.5 mb-5 border-b border-slate-100 pb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-heading transition-all cursor-pointer ${
            activeTab === 'all' 
              ? 'bg-slate-900 text-white' 
              : 'bg-white text-slate-550 border border-slate-205 hover:bg-slate-50'
          }`}
        >
          Semua Aturan ({rulesData.length})
        </button>
        <button
          onClick={() => setActiveTab('member')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-heading transition-all cursor-pointer ${
            activeTab === 'member' 
              ? 'bg-sky-650 text-white' 
              : 'bg-white text-slate-550 border border-slate-205 hover:bg-slate-50'
          }`}
        >
          Aturan Member Biasa
        </button>
        <button
          onClick={() => setActiveTab('leader')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-heading transition-all cursor-pointer ${
            activeTab === 'leader' 
              ? 'bg-emerald-650 text-white' 
              : 'bg-white text-slate-550 border border-slate-205 hover:bg-slate-50'
          }`}
        >
          Komandan & Petinggi
        </button>
        <button
          onClick={() => setActiveTab('sanksi')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-heading transition-all cursor-pointer ${
            activeTab === 'sanksi' 
              ? 'bg-rose-600 text-white' 
              : 'bg-white text-slate-550 border border-slate-205 hover:bg-slate-50'
          }`}
        >
          Sanksi & Alur SP
        </button>
      </div>

      {/* Rules Quick Search Bar */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id="rules-search-input"
          type="text"
          placeholder="Cari kata kunci aturan (contoh: WhatsApp, Komandan, TikTok, SP...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-100 shadow-soft font-smooth"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-650"
          >
            Bersihkan
          </button>
        )}
      </div>

      {/* Dynamic Rendered List */}
      <div className="space-y-6">
        {filteredRules.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-450 shadow-soft">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">Aturan tidak ditemukan</p>
            <p className="text-[10px] mt-1 text-slate-400">Tidak ada pasal atau ayat yang cocok dengan filter atau pencarian "{searchQuery}".</p>
          </div>
        ) : (
          filteredRules.map((cat, catIdx) => (
            <div key={catIdx} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-soft space-y-4">
              
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  {cat.icon}
                  <h3 className="font-heading font-extrabold text-xs text-slate-800 tracking-wide uppercase">
                    {cat.category}
                  </h3>
                </div>
                <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded leading-none ${
                  cat.tab === 'member' ? 'bg-sky-50 text-sky-700' :
                  cat.tab === 'leader' ? 'bg-emerald-50 text-emerald-700' :
                  'bg-rose-50 text-rose-700'
                }`}>
                  {cat.tab === 'member' ? 'MEMBER' :
                   cat.tab === 'leader' ? 'LEADER' :
                   'SANCTION'}
                </span>
              </div>

              {/* Articles & Ayats List */}
              <div className="space-y-5">
                {cat.articles.map((art, artIdx) => (
                  <div key={artIdx} className="pl-1 space-y-2">
                    <h4 className="font-heading font-bold text-[11.5px] text-slate-900 tracking-wide flex items-center gap-1">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 inline" />
                      <span>{art.pasal}</span>
                    </h4>
                    
                    <div className="space-y-2.5 pl-4 ml-1.5 border-l grid grid-cols-1 border-slate-200">
                      {art.ayats.map((ay, ayIdx) => (
                        <div key={ayIdx} className="text-[11px] leading-relaxed">
                          <span className="inline-block font-mono font-extrabold text-[9.5px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded uppercase mr-2 shrink-0">
                            {ay.num}
                          </span>
                          <span className="text-slate-650 font-smooth">{ay.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Compliance Confirmation Block */}
      <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4 text-center mt-8 mb-4 max-w-lg mx-auto">
        <p className="text-[10px] text-emerald-800 font-medium leading-relaxed font-smooth">
          Dengan menyelesaikan proses registrasi seleksi ECI, Anda dinyatakan secara sadar tunduk dan sepakat pada seluruh ketetapan peraturan di atas tanpa paksaan pihak mana pun.
        </p>
      </div>

      {/* Back button */}
      <div className="text-center pt-2">
        <button
          id="rules-bottom-back-btn"
          onClick={onBack}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 shadow-md cursor-pointer"
        >
          Kembali ke Halaman Utama
        </button>
      </div>

    </div>
  );
}
