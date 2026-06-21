import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QrCodeProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const QrCode: React.FC<QrCodeProps> = ({
  value,
  size = 100,
  fgColor = '#000000',
  bgColor = '#FFFFFF',
  className,
  style
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 1,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      },
      (error) => {
        if (error) {
          console.error('Error generating QR Code:', error);
        }
      }
    );
  }, [value, size, fgColor, bgColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className} 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        display: 'block', 
        borderRadius: '6px',
        ...style 
      }} 
    />
  );
};
