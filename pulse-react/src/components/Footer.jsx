const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-[#3a3a50] bg-[#1d1d2c] text-[#9a9ab0] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Brand */}
        <div>
          <a href="#top" className="text-lg font-bold text-white tracking-tight">
            Pulse<span className="text-[#e63946]">Fit</span>
          </a>
          <p className="text-xs text-[#9a9ab0] mt-1">
            Portland's high-performance fitness studio.
          </p>
        </div>

        {/* Anchor Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
          <a href="#classes" className="hover:text-white transition-colors">Classes</a>
          <a href="#trainers" className="hover:text-white transition-colors">Trainers</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-[#9a9ab0]">
          &copy; {CURRENT_YEAR} Pulse Fitness Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
