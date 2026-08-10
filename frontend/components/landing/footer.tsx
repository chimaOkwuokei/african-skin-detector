'use client'

export default function Footer() {
    return (
        <footer className="relative w-full  bg-gradient-to-br from-[#87CEEB] to-[#5CA0D3] text-[#1A1A1A]">

            {/* Main Content Area */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-14 flex flex-col md:flex-row justify-between gap-12">

                {/* Brand & Project Blurb */}
                <div className="flex flex-col gap-4 max-w-sm">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="relative pb-1 pr-2">
                            {/* Sparkles (Represents AI) */}
                            <svg
                                className="absolute -top-1 -right-1 w-4 h-4 text-black"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            >
                                <path d="M12 2v4M17 7l-2.5 2.5M7 7l2.5 2.5" />
                            </svg>

                            {/* AI Dermatology / Skin Scan Icon */}
                            <svg
                                className="w-7 h-7 text-black mt-1"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {/* Magnifying Glass (Triage/Scan) */}
                                <circle cx="10" cy="10" r="7" />
                                <line x1="15" y1="15" x2="21" y2="21" />
                                {/* Skin lesions/spots being analyzed */}
                                <circle cx="8" cy="9" r="1.5" fill="currentColor" stroke="none" />
                                <circle cx="11.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
                                <circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="none" />
                            </svg>
                        </div>
                        <span className="font-serif text-[26px] tracking-tight text-[#1A1A1A]">
                            Ileraderma
                        </span>
                    </div>
                    <p className="text-[14px] leading-relaxed font-medium opacity-80">
                        An AI-assisted dermatology triage system designed to equip frontline health workers in underserved clinics.
                    </p>
                </div>

                {/* Presentation Links */}
                <div className="flex flex-wrap gap-12 md:gap-20">
                    {/* Section Links */}
                    <div className="flex flex-col gap-3">
                        <span className="font-bold text-[15px] uppercase tracking-widest mb-2 opacity-90">
                            Presentation
                        </span>
                        {[
                            { label: 'The Problem', id: 'problem' },
                            { label: 'Our Solution', id: 'solution' },
                            { label: 'Team', id: 'team' }
                        ].map((link) => (
                            <a
                                key={link.label}
                                href={`#${link.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className="text-[14.5px] font-medium opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Contact / Context Info */}
                    <div className="flex flex-col gap-3">
                        <span className="font-bold text-[15px] uppercase tracking-widest mb-2 opacity-90">
                            Institution
                        </span>
                        <span className="text-[14.5px] font-medium opacity-75">
                            Carnegie Mellon University - Africa
                        </span>
                        <span className="text-[14.5px] font-medium opacity-75">
                            Kigali, Rwanda
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright & Scroll to Top Bar */}
            <div className="border-t border-[#1A1A1A]/10">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

                    <span className="text-[13px] font-medium opacity-70 text-center md:text-left">
                        &copy; 2026 DermAI Proposal. For academic demonstration only.
                    </span>

                    {/* Scroll to Top Button */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="text-[13px] font-bold uppercase tracking-wider hover:opacity-60 transition-opacity flex items-center gap-2"
                    >
                        Back to Top
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>

                </div>
            </div>
        </footer>
    );
}