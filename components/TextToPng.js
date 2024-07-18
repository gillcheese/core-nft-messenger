import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

const TextToPng = ({ text, onImageGenerated }) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (text && textRef.current) {
      html2canvas(textRef.current).then((canvas) => {
        const pngUrl = canvas.toDataURL('image/png');
        onImageGenerated(pngUrl);
      });
    }
  }, [text, onImageGenerated]);

  return (
    <div ref={textRef} style={{ padding: '20px', background: 'white' }}>
      {text}
    </div>
  );
};

export default TextToPng;