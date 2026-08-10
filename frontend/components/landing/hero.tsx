import React from 'react';

export default function Hero() {
  return (
    <div className="relative w-full bg-[#F9F9F6]">
      {/* =========================================
          HERO SECTION
      ========================================= */}
      <section className="relative w-full py-28 md:py-36 overflow-hidden flex items-center justify-center">
        {/* --- MAIN CONTENT --- */}
        <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center flex flex-col items-center">
          
          {/* Headline */}
          <h1 className="text-[42px] md:text-[68px] font-serif text-[#333532] leading-[1.15] tracking-tight">
            Revolutionizing Skin Triage <br className="hidden md:block" />
            with AI Precision
          </h1>
          
          {/* Sub-headline */}
          <p className="mt-6 text-[15px] md:text-[17px] text-[#555555] max-w-[680px] leading-relaxed">
            Equip frontline health workers to detect skin conditions earlier, flag serious cases faster, and improve patient care with advanced AI-powered dermatology intelligence.
          </p>
          
          {/* Split CTA Button */}
          <div className="mt-10 flex items-stretch gap-[2px]">
            <button className="bg-[#333532] hover:bg-[#1A1A1A] text-white text-[15px] font-medium px-8 py-3.5 transition-colors">
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-20 w-full max-w-[1050px] mx-auto px-4 md:px-8 pb-20 -mt-12">
        {/* Outer Light Sky Blue Border Area */}
        <div className="bg-[#EBF5FA] p-3 md:p-5 border border-[#BDE2F2] shadow-xl">
          {/* Inner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 h-auto md:h-[320px]">
            
            {/* 1. Left Panel: Risk Level */}
            <div className="bg-[#5CA0D3] p-6 flex flex-col items-center justify-between text-white text-center h-full">
              <h3 className="font-serif text-[20px] tracking-wide mt-2">Risk Level</h3>
              
              {/* SVG Gauge (Kept standard Green/Yellow/Red for risk indication) */}
              <div className="relative w-48 h-28 mt-4">
                <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4ADE80" />  {/* Green */}
                      <stop offset="50%" stopColor="#FACC15" /> {/* Yellow */}
                      <stop offset="100%" stopColor="#EF4444" /> {/* Red */}
                    </linearGradient>
                  </defs>
                  {/* Background Track */}
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="14" strokeLinecap="round" />
                  {/* Progress Track (Approx 75% full -> Dasharray 188 of 251) */}
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#riskGradient)" strokeWidth="14" strokeLinecap="round" strokeDasharray="188 251" />
                </svg>
                {/* Score Text inside the gauge */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-1">
                  <span className="text-[34px] font-serif font-light tracking-wide">75/100</span>
                </div>
              </div>

              <p className="text-[14px] mt-6 tracking-wide opacity-95">Overall Risk: Elevated</p>
            </div>

            {/* 2. Middle Panel: Clinical Image */}
            <div className="h-64 md:h-full w-full overflow-hidden relative bg-[#E2E8F0]">
              {/* Using a stock dermatology/skin check image. Replace src with your own asset later! */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://www.usdermatologypartners.com/wp-content/uploads/2023/03/AdobeStock_242981513_Resized.jpeg" 
                alt="Dermatology Skin Scan" 
                className="w-full h-full object-cover relative z-10"
              />
            </div>

            {/* 3. Right Panel: AI Analysis Details */}
            <div className="bg-[#5CA0D3] p-6 flex flex-col items-center justify-between text-white text-center h-full">
              <h3 className="font-serif text-[20px] uppercase tracking-wider mt-2">AI Skin Scan</h3>
              
              {/* Custom AI Scanning Icon */}
              <div className="w-28 h-28 my-auto relative flex items-center justify-center">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-20 h-20 text-white/95 drop-shadow-sm">
                    {/* Viewfinder Target */}
                    <path d="M4 8V6a2 2 0 0 1 2-2h2" strokeLinecap="round" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v2" strokeLinecap="round" />
                    <path d="M20 16v2a2 2 0 0 1-2 2h-2" strokeLinecap="round" />
                    <path d="M8 20H6a2 2 0 0 1-2-2v-2" strokeLinecap="round" />
                    {/* Inner Skin Lesion Abstract */}
                    <circle cx="12" cy="12" r="3.5" fill="currentColor" opacity="0.9" />
                    <circle cx="12" cy="12" r="6.5" strokeDasharray="3 3" strokeWidth="1.5" />
                 </svg>
              </div>

              <div className="flex flex-col items-center gap-1.5 mt-4">
                <p className="text-[13px] opacity-90 tracking-wide">Lesion #1 · Left Forearm</p>
                <p className="text-[14px] font-medium flex items-center gap-1.5 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Flagged for Review
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}