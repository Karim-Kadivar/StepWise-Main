import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

interface LottiePlayerProps {
  url: string;
  style?: React.CSSProperties;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export const LottiePlayer: React.FC<LottiePlayerProps> = ({ url, style, loop = true, autoplay = true, className }) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load lottie');
        return res.json();
      })
      .then(data => {
        if (isMounted) setAnimationData(data);
      })
      .catch(err => {
        console.warn("Lottie Load Error:", err);
      });
      
    return () => { isMounted = false; };
  }, [url]);

  if (!animationData) return <div style={style} className={`animate-pulse bg-white/5 rounded-lg ${className || ''}`} />;

  return <Lottie animationData={animationData} loop={loop} autoPlay={autoplay} style={style} className={className} />;
};