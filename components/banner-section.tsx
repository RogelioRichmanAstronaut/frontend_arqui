"use client";

import { useEffect, useState } from "react";

interface BannerSectionProps {
  imageUrl: string;
  children: React.ReactNode;
  className?: string;
}

export function BannerSection({ imageUrl, children, className = "" }: BannerSectionProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Precargar la imagen para evitar recargas
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <section className={`relative h-[300px] flex items-center justify-center bg-gradient-to-b from-[#0A2540]/80 to-[#0A2540]/60 ${className}`}>
      {/* Imagen oculta para precarga y cache */}
      <img
        src={imageUrl}
        alt=""
        className="hidden"
        loading="eager"
        fetchPriority="high"
        onLoad={() => setImageLoaded(true)}
      />
      <div
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat transition-opacity duration-300"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          opacity: imageLoaded ? 1 : 0.7,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/60 z-10" />
      {children}
    </section>
  );
}

