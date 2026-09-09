import React from 'react';

interface CimahiLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  showText?: boolean;
  animatePulse?: boolean;
}

export const CimahiLogo: React.FC<CimahiLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = false,
  animatePulse = false,
}) => {
  // Mapping ukuran container presisi
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
    '3xl': 'w-24 h-24'
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Container Lambang Logo Kota Cimahi */}
      <div 
        className={`${sizeMap[size]} shrink-0 relative flex items-center justify-center ${
          animatePulse ? 'animate-pulse' : ''
        }`}
      >
        <svg 
          viewBox="0 0 400 480" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs select-none overflow-visible"
        >
          {/* 1. TULISAN ATAS "CIMAHI" */}
          <text
            x="200"
            y="70"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', Inter, sans-serif"
            fontWeight="900"
            fontSize="46"
            letterSpacing="6"
            fill="#1B2B65"
          >
            CIMAHI
          </text>

          {/* 2. PERISAI UTAMA ORANYE (SHIELD BACKGROUND) */}
          <g id="Shield">
            {/* Bagian Perisai Oranye Atas & Lengkungan Bawah */}
            <path
              d="M 100 95 L 300 95 L 300 240 C 300 320 200 365 200 365 C 200 365 100 320 100 240 Z"
              fill="#E67319"
            />
          </g>

          {/* 3. LINGKARAN PUTIH DI DALAM PERISAI */}
          <g id="InnerWhiteCircle">
            <circle
              cx="200"
              cy="230"
              r="95"
              fill="#FFFFFF"
            />
          </g>

          {/* 4. MOTIF PABRIK / INDUSTRI HIJAU & MERAH (SIMBOL INDUSTRI KOTA CIMAHI) */}
          <g id="IndustryMotif">
            {/* Sayap Kiri Hijau (Chevron bertingkat 3) */}
            {/* Tier 1 Hijau Kiri */}
            <path
              d="M 130 185 L 158 150 L 175 168 L 175 182 L 158 165 L 130 200 Z"
              fill="#0F9747"
            />
            {/* Tier 2 Hijau Kiri */}
            <path
              d="M 130 215 L 158 180 L 175 198 L 175 212 L 158 195 L 130 230 Z"
              fill="#0F9747"
            />
            {/* Tier 3 Hijau Kiri */}
            <path
              d="M 130 245 L 158 210 L 175 228 L 175 242 L 158 225 L 130 260 Z"
              fill="#0F9747"
            />

            {/* Sayap Kanan Hijau (Chevron bertingkat 3) */}
            {/* Tier 1 Hijau Kanan */}
            <path
              d="M 270 185 L 242 150 L 225 168 L 225 182 L 242 165 L 270 200 Z"
              fill="#0F9747"
            />
            {/* Tier 2 Hijau Kanan */}
            <path
              d="M 270 215 L 242 180 L 225 198 L 225 212 L 242 195 L 270 230 Z"
              fill="#0F9747"
            />
            {/* Tier 3 Hijau Kanan */}
            <path
              d="M 270 245 L 242 210 L 225 228 L 225 242 L 242 225 L 270 260 Z"
              fill="#0F9747"
            />

            {/* Pilar Tengah Merah (Chevron Tengah bertingkat 3) */}
            {/* Tier 1 Merah */}
            <path
              d="M 175 168 L 200 196 L 225 168 L 225 182 L 200 210 L 175 182 Z"
              fill="#DC2626"
            />
            {/* Tier 2 Merah */}
            <path
              d="M 175 198 L 200 226 L 225 198 L 225 212 L 200 240 L 175 212 Z"
              fill="#DC2626"
            />
            {/* Tier 3 Merah */}
            <path
              d="M 175 228 L 200 256 L 225 228 L 225 242 L 200 270 L 175 242 Z"
              fill="#DC2626"
            />
          </g>

          {/* 5. MOTIF GELOMBANG AIR SUNGAI CIMAHI (5 LAPIS GELOMBANG BIRU TUA & BIRU MUDA) */}
          <g id="WaterWaves">
            {/* Clip path agar gelombang terpotong rapi mengikuti bentuk lingkaran/perisai */}
            <defs>
              <clipPath id="shieldClip">
                <path d="M 100 95 L 300 95 L 300 240 C 300 320 200 365 200 365 C 200 320 100 240 100 240 Z" />
              </clipPath>
            </defs>

            <g clipPath="url(#shieldClip)">
              {/* Gelombang 1: Biru Tua Paling Atas */}
              <path
                d="M 80 250 L 115 285 L 155 245 L 200 288 L 245 245 L 285 285 L 320 250 L 320 370 L 80 370 Z"
                fill="#162A72"
              />

              {/* Gelombang 2: Biru Terang (Cyan/Sky Blue) */}
              <path
                d="M 80 270 L 115 305 L 155 265 L 200 308 L 245 265 L 285 305 L 320 270 L 320 370 L 80 370 Z"
                fill="#0094D9"
              />

              {/* Gelombang 3: Biru Tua Tengah */}
              <path
                d="M 80 290 L 115 325 L 155 285 L 200 328 L 245 285 L 285 325 L 320 290 L 320 370 L 80 370 Z"
                fill="#162A72"
              />

              {/* Gelombang 4: Biru Terang Bawah */}
              <path
                d="M 80 310 L 115 345 L 155 305 L 200 348 L 245 305 L 285 345 L 320 310 L 320 370 L 80 370 Z"
                fill="#0094D9"
              />

              {/* Gelombang 5: Biru Tua Paling Dasar */}
              <path
                d="M 80 330 L 115 365 L 155 325 L 200 368 L 245 325 L 285 365 L 320 330 L 320 370 L 80 370 Z"
                fill="#162A72"
              />
            </g>
          </g>

          {/* 6. PITA SEMBOYAN ORANYE BAWAH (RIBBON BANNER) */}
          <g id="RibbonBanner">
            {/* Jalur Pita Melengkung */}
            <path
              id="ribbonArc"
              d="M 75 320 C 130 405 270 405 325 320 L 340 335 C 280 435 120 435 60 335 Z"
              fill="#E67319"
            />

            {/* Jalur Khusus untuk Penempatan Teks Mengikuti Lengkungan Pita */}
            <path
              id="textPathArc"
              d="M 70 332 C 130 422 270 422 330 332"
              fill="none"
            />

            {/* Teks Semboyan: "SALUYU NGAWANGUN JATI MANDIRI" */}
            <text
              fill="#FFFFFF"
              fontFamily="'Plus Jakarta Sans', Inter, sans-serif"
              fontWeight="900"
              fontSize="16.5"
              letterSpacing="2.5"
            >
              <textPath 
                href="#textPathArc" 
                startOffset="50%" 
                textAnchor="middle"
              >
                SALUYU NGAWANGUN JATI MANDIRI
              </textPath>
            </text>
          </g>
        </svg>
      </div>

      {/* Identitas Teks Bapenda Kota Cimahi */}
      {showText && (
        <div className="flex flex-col min-w-0 text-left">
          <span className="text-[13px] sm:text-sm font-black tracking-tight text-[#1B365D] uppercase leading-none">
            BAPENDA
          </span>
          <span className="text-xs font-bold text-[#E67E22] leading-tight">
            KOTA CIMAHI
          </span>
          <span className="text-[9px] text-slate-400 font-medium tracking-wide">
            Saluyu Ngawangun Jati Mandiri
          </span>
        </div>
      )}
    </div>
  );
};
