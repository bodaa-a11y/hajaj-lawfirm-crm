import React from 'react';
import { FIRM_DETAILS } from '../data/lawFirmData';
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck, ChevronLeft } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { id: 'hero', label: 'الرئيسية' },
    { id: 'about', label: 'من نحن' },
    { id: 'services', label: 'خدماتنا' },
    { id: 'principles', label: 'مبادئنا' },
  ];

  const helpfulLinks = [
    { label: 'وزارة العدل', href: 'https://www.moj.gov.sa' },
    { label: 'منصة ناجز', href: 'https://najiz.sa' },
    { label: 'صحيفة الدعوى الإلكترونية', href: 'https://najiz.sa' },
    { label: 'إصدار وكالة إلكترونية', href: 'https://najiz.sa' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -85;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="relative bg-[#071B23] text-[#FAF7F2] pt-0 pb-0 overflow-hidden">

      {/* ── Top Gold Accent Line ── */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-[#C9AA67] to-transparent" />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* ══════════════════════════════════════════
            MAIN FOOTER GRID 
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 py-14 md:py-16">

          {/* ── Column 1: Brand ── */}
          <div className="lg:col-span-1 text-right">
            <p className="text-[13px] text-[#8CA8B8] leading-[1.9] mb-5">
              {FIRM_DETAILS.slogan}
            </p>
            {/* Licensing */}
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-[11px] text-[#6A8E9E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9AA67]" />
                {FIRM_DETAILS.licenseNumber}
              </span>
              <span className="flex items-center gap-2 text-[11px] text-[#6A8E9E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9AA67]" />
                {FIRM_DETAILS.barAssociation}
              </span>
            </div>
          </div>

          {/* ── Column 2: Site Links ── */}
          <div className="text-right">
            <h4 className="text-sm font-bold text-white mb-5 flex items-center gap-2 justify-start">
              <span className="w-6 h-[2px] bg-[#C9AA67] rounded-full" />
              أقسام الموقع
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="group flex items-center gap-2 text-[13px] text-[#8CA8B8] hover:text-[#C9AA67] transition-colors duration-200 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-[#C9AA67]/50 group-hover:text-[#C9AA67] transition-colors" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Helpful Links ── */}
          <div className="text-right">
            <h4 className="text-sm font-bold text-white mb-5 flex items-center gap-2 justify-start">
              <span className="w-6 h-[2px] bg-[#C9AA67] rounded-full" />
              روابط تهمك
            </h4>
            <ul className="space-y-3">
              {helpfulLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 text-[13px] text-[#8CA8B8] hover:text-[#C9AA67] transition-colors duration-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#C9AA67]/50 group-hover:text-[#C9AA67] transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Contact Info ── */}
          <div className="text-right">
            <h4 className="text-sm font-bold text-white mb-5 flex items-center gap-2 justify-start">
              <span className="w-6 h-[2px] bg-[#C9AA67] rounded-full" />
              تواصل معنا
            </h4>
            <ul className="space-y-4">
              <li>
                <a href={FIRM_DETAILS.maps} target="_blank" rel="noreferrer" className="flex items-start gap-3 text-[13px] text-[#8CA8B8] hover:text-[#C9AA67] transition-colors">
                  <MapPin className="w-4 h-4 text-[#C9AA67] shrink-0 mt-0.5" />
                  <span>{FIRM_DETAILS.address}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${FIRM_DETAILS.phone}`} className="flex items-center gap-3 text-[13px] text-[#8CA8B8] hover:text-[#C9AA67] transition-colors">
                  <Phone className="w-4 h-4 text-[#C9AA67] shrink-0" />
                  <span dir="ltr">{FIRM_DETAILS.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${FIRM_DETAILS.email}`} className="flex items-center gap-3 text-[13px] text-[#8CA8B8] hover:text-[#C9AA67] transition-colors">
                  <Mail className="w-4 h-4 text-[#C9AA67] shrink-0" />
                  <span>{FIRM_DETAILS.email}</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ══════════════════════════════════════════
            BOTTOM BAR: Social + Copyright
        ══════════════════════════════════════════ */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-5">

          {/* Social Icons */}
          <div className="flex items-center gap-2.5 order-1 sm:order-2">
            {/* X / Twitter */}
            <a href={FIRM_DETAILS.twitter} target="_blank" rel="noreferrer" aria-label="منصة إكس"
              className="w-10 h-10 rounded-xl bg-[#0D2A35] border border-[#1A3D4D] hover:border-[#C9AA67]/60 hover:bg-[#C9AA67]/10 text-[#8CA8B8] hover:text-[#C9AA67] flex items-center justify-center transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a href={`https://wa.me/${FIRM_DETAILS.whatsapp}`} target="_blank" rel="noreferrer" aria-label="واتساب"
              className="w-10 h-10 rounded-xl bg-[#0D2A35] border border-[#1A3D4D] hover:border-[#25D366]/60 hover:bg-[#25D366]/10 text-[#8CA8B8] hover:text-[#25D366] flex items-center justify-center transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>

            {/* Snapchat */}
            <a href={FIRM_DETAILS.snapchat} target="_blank" rel="noreferrer" aria-label="سناب شات"
              className="w-10 h-10 rounded-xl bg-[#0D2A35] border border-[#1A3D4D] hover:border-[#FFFC00]/60 hover:bg-[#FFFC00]/10 text-[#8CA8B8] hover:text-[#FFFC00] flex items-center justify-center transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>
              </svg>
            </a>

            {/* Email */}
            <a href={`mailto:${FIRM_DETAILS.email}`} aria-label="البريد الإلكتروني"
              className="w-10 h-10 rounded-xl bg-[#0D2A35] border border-[#1A3D4D] hover:border-[#EA4335]/60 hover:bg-[#EA4335]/10 text-[#8CA8B8] hover:text-[#EA4335] flex items-center justify-center transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-[12px] text-[#5A7A8A] order-2 sm:order-1 text-center sm:text-right">
            جميع الحقوق محفوظة © {currentYear} {FIRM_DETAILS.name}
          </p>
        </div>

      </div>
    </footer>
  );
};
