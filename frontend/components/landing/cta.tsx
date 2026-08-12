import Link from 'next/link';
import React from 'react';

export default function CTA() {
  return (
    <section id="cta" className="w-full bg-[#F9F9F6] py-12 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">

        {/* Gradient Container */}
        <div className="relative overflow-hidden rounded-[12px] bg-gradient-to-br from-[#5CA0D3] to-[#87CEEB] px-8 py-16 md:py-24 text-center">

          {/* Abstract Background Elements for Depth */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white opacity-20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#1A1A1A] opacity-10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">

            <h2 className="text-[36px] md:text-[48px] font-serif text-white leading-[1.15] tracking-tight mb-4 max-w-[700px] text-center">
              Ready to bridge the gap in dermatological care?
            </h2>

            <p className="text-white/90 text-[16px] md:text-[18px] leading-relaxed max-w-[650px] mb-12 font-medium text-center">
              Expert dermatology shouldn't depend on a patient's location. Equip your frontline staff with AI triage, or log in as a remote specialist to help clear the backlog of urgent cases.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">

              {/* Clinician Button */}
              <Link
                href="/clinics"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#5CA0D3] hover:bg-gray-50 text-[15px] font-bold px-8 py-4 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Get Started as Clinician
              </Link>
              {/* Dermatologist Button */}
              <Link
                href="/dermatologists"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#5CA0D3] hover:bg-gray-50 text-[15px] font-bold px-8 py-4 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
              > 
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Get Started as Dermatologist
              </Link>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}