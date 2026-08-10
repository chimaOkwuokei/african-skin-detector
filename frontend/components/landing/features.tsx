import React from 'react';

export default function Features() {
  const stats = [
    { value: "1 : 1M", label: "Dermatologist to Population Ratio" },
    { value: "2.9", label: "Doctors per 10,000 people (WHO recommends 17)" },
    { value: "75%", label: "Healthcare workers concentrated in urban areas" },
    { value: "4,193", label: "Doctors left Nigeria in 2024 (200% spike)" },
  ];

  const features = [
    {
      title: "Point-of-Care AI Analysis",
      description: "Local clinicians upload photos and medical history. The system uses MedGemma to analyze the image and generate a preliminary diagnosis instantly.",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      )
    },
    {
      title: "Built for African Skin Tones",
      description: "Leverages the PASSION dataset (4,901 images from 1,653 Sub-Saharan patients) to combat algorithmic bias and effectively identify conditions common to the region.",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      )
    },
    {
      title: "Automated Triage & Severity Scoring",
      description: "The AI calculates a severity score to instantly determine if the clinician can treat the condition locally or if it requires urgent specialist intervention.",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      )
    },
    {
      title: "Store-and-Forward Teledermatology",
      description: "When a case is flagged, the app securely bundles the patient's data and routes it to a remote, licensed dermatologist, reducing unnecessary in-person referrals.",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      )
    },
    {
      title: "Guaranteed Expert Feedback",
      description: "The matched specialist reviews the digital file through the platform and sends back a formal diagnosis and treatment plan to the local clinic within an agreed-upon turnaround time.",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.298l-2.585 2.585a1.5 1.5 0 001.882 2.912z" />
        </svg>
      )
    }
  ];

  return (
    <section id="problem" className="w-full bg-[#F9F9F6] py-20 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* =========================================
            PART 1: THE DIAGNOSTIC GAP (Problem)
        ========================================= */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-32">
          {/* Text Left */}
          <div className="lg:w-5/12 flex flex-col justify-center">
            <span className="text-[#5CA0D3] font-bold tracking-widest text-[13px] uppercase mb-4 block">The Problem</span>
            <h2 className="text-[36px] md:text-[44px] font-serif text-[#333532] leading-[1.15] mb-6">
              The Diagnostic Gap in African Healthcare
            </h2>
            <p className="text-[#555555] text-[16px] leading-relaxed mb-6">
              Nigeria is currently facing a severe dermatology crisis. This isn't just a pipeline issue caused by too few medical students choosing the specialty; it is a full-blown brain drain.
            </p>
            <p className="text-[#555555] text-[16px] leading-relaxed">
              Without local specialists, rural patients are forced to choose between expensive, time-consuming travel to urban hospitals or relying on guesswork from unqualified sources, driving massive scale untreated skin conditions.
            </p>
          </div>

          {/* Stats Grid Right */}
          <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[20px] border border-[#E8E8E1]">
                <div className="text-[40px] md:text-[48px] font-serif text-[#5CA0D3] leading-none mb-3">
                  {stat.value}
                </div>
                <div className="text-[#4A4A4A] text-[14px] font-medium leading-tight pr-4">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================
            PART 2: OUR SOLUTION (Features)
        ========================================= */}
        <div id="features" className="pt-8 border-t border-[#E8E8E1]">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <span className="text-[#5CA0D3] font-bold tracking-widest text-[13px] uppercase mb-4 block">Our Solution</span>
            <h2 className="text-[36px] md:text-[44px] font-serif text-[#333532] leading-[1.15] mb-6">
              Core Features
            </h2>
            <p className="text-[#555555] text-[16px] leading-relaxed">
              We are building an AI-assisted web application that acts as a clinical decision support and triage tool. Instead of replacing doctors, the platform extends the reach of the limited specialists available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className={`bg-white p-8 rounded-[20px] border border-[#E8E8E1]  transition-shadow flex flex-col items-start ${
                  // Make the last feature span 2 columns on tablet, or 1 on desktop to balance a 5-item grid
                  idx === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="w-14 h-14 bg-[#EBF5FA] rounded-2xl flex items-center justify-center text-[#5CA0D3] mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-[20px] font-serif text-[#333532] mb-3 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-[#555555] text-[15px] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}