"use client";
import * as React from "react";
import twemoji from "twemoji";
import { cn } from "@/lib/utils";

export function emojiToUrl(char: string, format: 'svg' | 'png' = 'svg') {
  try {
    console.log('🔍 Converting emoji:', char, 'Format:', format);
    
    if (!char || char.length === 0) {
      console.warn('⚠️ Empty emoji character');
      return '';
    }
    
    // handle multi-codepoint & variation selector
    const cp = twemoji.convert.toCodePoint(char);
    console.log('✅ Code point:', cp);
    
    if (format === 'png') {
      // Use PNG format - more compatible
      const url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${cp}.png`;
      console.log('🖼️ PNG URL:', url);
      return url;
    } else {
      // Use SVG format
      const url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${cp}.svg`;
      console.log('🎨 SVG URL:', url);
      return url;
    }
  } catch (error) {
    console.error('❌ Error converting emoji to URL:', char, error);
    return '';
  }
}

export function Emoji({
  char,
  size = 20,
  className,
  title,
}: {
  char: string;
  size?: number;
  className?: string;
  title?: string;
}) {
  const [currentFormat, setCurrentFormat] = React.useState<'svg' | 'png'>('svg');
  const [imgSrc, setImgSrc] = React.useState<string>('');
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (char) {
      console.log('🔄 Emoji component effect triggered for:', char);
      const url = emojiToUrl(char, currentFormat);
      if (url) {
        console.log('📥 Setting image source:', url);
        setImgSrc(url);
        setHasError(false);
        setIsLoading(true);
      } else {
        console.log('⚠️ No URL generated, using fallback');
        setHasError(true);
        setIsLoading(false);
      }
    }
  }, [char, currentFormat]);

  // Handle image load success
  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', imgSrc);
    setIsLoading(false);
    setHasError(false);
  };

  // Handle image load error with format fallback
  const handleImageError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('❌ Image failed to load:', imgSrc, 'Format:', currentFormat);
    
    if (currentFormat === 'svg') {
      console.log('🔄 Retrying with PNG format...');
      setCurrentFormat('png');
      setHasError(false);
      setIsLoading(true);
    } else {
      console.log('🔄 Both SVG and PNG failed, using font fallback');
      setHasError(true);
      setIsLoading(false);
    }
  };

  // If both formats failed, use font emoji fallback
  if (hasError || (!imgSrc && currentFormat === 'png')) {
    console.log('🔄 Using font emoji fallback for:', char);
    return (
      <span 
        className={cn("inline-block align-middle select-none font-emoji", className)}
        style={{ fontSize: size }}
        title={title || char}
      >
        {char}
      </span>
    );
  }

  // Loading state
  if (isLoading) {
    console.log('⏳ Image is loading:', imgSrc, 'Format:', currentFormat);
  }

  return (
    <img
      src={imgSrc}
      alt={char}
      title={title || char}
      width={size}
      height={size}
      className={cn("inline-block align-middle select-none", className)}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={handleImageLoad}
      onError={handleImageError}
      style={{ 
        border: '1px solid transparent',
        minWidth: size,
        minHeight: size,
        objectFit: 'contain'
      }}
    />
  );
}
