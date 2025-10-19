'use client';
import React from 'react';

interface MarqueeTextProps {
  text: string;
  className?: string;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({ text, className = '' }) => {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="animate-marquee inline-block">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="mx-8">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;