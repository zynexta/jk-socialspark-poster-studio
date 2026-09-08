import React from 'react';
import { Camera, User, GraduationCap, School, Award, Calendar, Phone, Image as ImageIcon, QrCode, PenTool, Type, Plus } from 'lucide-react';

const PLACEHOLDER_TYPES = [
  {
    type: 'photo',
    label: 'Photo Placeholder',
    desc: 'Student or Customer Photo upload box',
    icon: Camera,
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
    defaultProps: {
      text: 'Ph: +91 98765 43210 | www.jksocialspark.com',
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
    desc: 'JK SocialSpark or partner brand logo',
    icon: ImageIcon,
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
    defaultProps: {
      width: 120,
      height: 120,
      placeholderImg: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://jksocialspark.com',
      borderRadius: 8,
    }
  },
  {
    type: 'signature',
    label: 'Signature',
    desc: 'Principal / Director signature box',
    icon: PenTool,
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

export default function PlaceholderToolbar({ onAddPlaceholder }) {
  return (
    <div className="w-72 border-r border-[#E5E5E5] flex flex-col h-full overflow-hidden bg-[#FFFFFF] text-[#111111]">
      <div className="p-4 border-b border-[#E5E5E5] bg-[#F8F8F6]">
        <h3 className="font-heading font-black text-base flex items-center gap-2 text-[#0A0A0A]">
          <Plus className="w-5 h-5 text-[#C1121F]" />
          Add Placeholders
        </h3>
        <p className="text-xs mt-1 text-[#555555] font-medium leading-relaxed">
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
              className="w-full text-left p-3 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#FFF1F2] hover:border-[#C1121F] transition-all duration-200 flex items-center gap-3 group hover:shadow-xs hover:translate-x-0.5"
            >
              <div className="p-2 rounded-lg bg-[#F8F8F6] border border-[#E5E5E5] text-[#C1121F] group-hover:bg-[#C1121F] group-hover:text-white transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-xs block truncate text-[#0A0A0A]">
                  {item.label}
                </span>
                <span className="text-[10px] block truncate text-[#555555] font-medium">
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
