'use client'
export default function Header() {
  return (
    <header className="w-full bg-[#F9F9F6] border-b border-[#E8E8E1]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-[88px] flex items-center justify-between">
        {/* Logo Section */}
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

        {/* Navigation Section */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { label: "Home", id: "home" },
            { label: "Features", id: "features" },
            { label: "CTA", id: "cta" },
            { label: "Collaborators", id: "collaborators" }
          ].map((item) => (
            <a
              key={item.label}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault(); 
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start' 
                });
              }}
              className="text-[15px] font-medium text-[#4A4A4A] hover:text-black transition-colors cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Button Section */}
        <div>
          <button className="bg-[#2D2D2D] hover:bg-[#1A1A1A] text-white text-[15px] font-medium px-7 py-3 transition-colors shadow-sm">
            Contact Us
          </button>
        </div>

      </div>
    </header>
  );
}