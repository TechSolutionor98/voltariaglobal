'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageZoomProps {
  src: string;
  alt: string;
  isZoomable?: boolean;
  objectFit?: 'cover' | 'contain';
}

export default function ImageZoom({ src, alt, isZoomable = true, objectFit = 'cover' }: ImageZoomProps) {
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomable || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => isZoomable && setIsHovered(true)}
      onMouseLeave={() => isZoomable && setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        unoptimized={true}
        className={`transition-transform duration-300 ease-out mix-blend-multiply ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} ${isZoomable && isHovered ? 'cursor-crosshair' : ''}`}
        style={{
          transform: isHovered ? 'scale(2.5)' : 'scale(1)',
          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
        }}
      />
    </div>
  );
}
