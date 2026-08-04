import React from 'react';
import { Camera, User, GraduationCap, School, Award, Calendar, Phone, Image as ImageIcon, QrCode, PenTool, Type, Plus } from 'lucide-react';

const PLACEHOLDER_TYPES = [
  {
    type: 'photo',
    label: 'Photo Placeholder',
    desc: 'Student or Customer Photo upload box',
    icon: Camera,
    color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:border-cyan-400',
    defaultProps: {
      width: 280,
      height: 340,
      borderRadius: 16,
      borderWidth: 3,
      borderColor: '#38BDF8',
      shadow: true,
    }
  },
  {
    type: 'student_name',
    label: 'Student Name',
    desc: 'Dynamic name field',
    icon: User,
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:border-blue-400',
    defaultProps: {
      text: 'STUDENT NAME HERE',
      width: 500,
      height: 50,
      fontSize: 34,
      fontFamily: 'Outfit',
      fontWeight: 'bold',
      color: '#FFFFFF',
      align: 'center',
    }
  },
  {
    type: 'class',
    label: 'Class / Stream',
    desc: 'Grade, SSLC, Plus Two, Science, Commerce',
    icon: GraduationCap,
    color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:border-indigo-400',
    defaultProps: {
      text: 'SSLC / 10th Grade Stream',
      width: 450,
      height: 40,
      fontSize: 20,
      fontFamily: 'Inter',
      fontWeight: 'normal',
      color: '#94A3B8',
      align: 'center',
    }
  },
  {
    type: 'school',
    label: 'School / Institution',
    desc: 'School or college name',
    icon: School,
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:border-purple-400',
    defaultProps: {
      text: 'St. Joseph Higher Secondary School',
      width: 550,
      height: 40,
      fontSize: 22,
      fontFamily: 'Inter',
      fontWeight: '500',
      color: '#E2E8F0',
      align: 'center',
    }
  },
  {
    type: 'rank',
    label: 'Rank / GPA / Grade',
    desc: 'Full A+, State 1st Rank, Distinction',
    icon: Award,
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:border-amber-400',
    defaultProps: {
      text: 'FULL A+ (10/10 GPA)',
      width: 400,
      height: 45,
      fontSize: 22,
      fontFamily: 'Outfit',
      fontWeight: 'bold',
      color: '#FACC15',
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      borderRadius: 20,
      align: 'center',
    }
  },
  {
    type: 'date',
    label: 'Date / Event Time',
    desc: 'Event date, ceremony date',
    icon: Calendar,
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:border-emerald-400',
    defaultProps: {
      text: 'Date: 15th August 2026',
      width: 350,
      height: 35,
      fontSize: 18,
      fontFamily: 'Inter',
      fontWeight: '500',
      color: '#A7F3D0',
      align: 'center',
    }
  },
  {
    type: 'phone',
    label: 'Phone / Contact',
    desc: 'Contact phone & website link',
    icon: Phone,
    color: 'bg-teal-500/10 text-teal-400 border-teal-500/30 hover:border-teal-400',
    defaultProps: {
      text: 'Ph: +91 98765 43210 | www.zynexta.com',
      width: 500,
      height: 35,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      color: '#E2E8F0',
      align: 'center',
    }
  },
  {
    type: 'logo',
    label: 'Brand Logo',
    desc: 'Zynexta or partner brand logo',
    icon: ImageIcon,
    color: 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:border-rose-400',
    defaultProps: {
      width: 140,
      height: 70,
      placeholderImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      borderRadius: 8,
    }
  },
  {
    type: 'qr_code',
    label: 'QR Code',
    desc: 'Location or website link QR code',
    icon: QrCode,
    color: 'bg-sky-500/10 text-sky-400 border-sky-500/30 hover:border-sky-400',
    defaultProps: {
      width: 120,
      height: 120,
      placeholderImg: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://zynexta.com',
      borderRadius: 8,
    }
  },
  {
    type: 'signature',
    label: 'Signature',
    desc: 'Principal / Director signature box',
    icon: PenTool,
    color: 'bg-violet-500/10 text-violet-400 border-violet-500/30 hover:border-violet-400',
    defaultProps: {
      text: '[Authorized Signature]',
      width: 220,
      height: 50,
      fontSize: 16,
      fontFamily: 'Playfair Display',
      fontWeight: 'normal',
      color: '#E2E8F0',
      align: 'center',
    }
  },
  {
    type: 'custom_text',
    label: 'Custom Headline / Subtitle',
    desc: 'Any custom text heading or banner',
    icon: Type,
    color: 'bg-slate-500/10 text-slate-300 border-slate-500/30 hover:border-slate-300',
    defaultProps: {
      text: 'SPECIAL CELEBRATION',
      width: 600,
      height: 50,
      fontSize: 32,
      fontFamily: 'Outfit',
      fontWeight: 'bold',
      color: '#FFFFFF',
      align: 'center',
    }
  }
];

export default function PlaceholderToolbar({ onAddPlaceholder, isDarkMode = true }) {
  return (
    <div className={`w-72 border-r flex flex-col h-full overflow-hidden transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      <div className={`p-4 border-b ${isDarkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/50'}`}>
        <h3 className={`font-heading font-bold text-base flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          <Plus className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          Add Placeholders
        </h3>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Click any element to drop dynamic field onto your poster template.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {PLACEHOLDER_TYPES.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.type}
              onClick={() => onAddPlaceholder(item.type, item.label, item.defaultProps)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-center gap-3 group hover:shadow-md hover:translate-x-1 ${
                isDarkMode
                  ? `${item.color}`
                  : 'border-slate-200/80 bg-slate-50/70 hover:bg-blue-50/40 hover:border-blue-300'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all group-hover:scale-110 ${
                isDarkMode
                  ? 'bg-slate-950/60 text-slate-200'
                  : 'bg-white shadow-xs border border-slate-100 text-blue-600 group-hover:text-blue-700'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`font-semibold text-xs block truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  {item.label}
                </span>
                <span className={`text-[10px] block truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
