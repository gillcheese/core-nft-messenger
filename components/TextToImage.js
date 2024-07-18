import React, { useRef, useEffect } from 'react';

const TextToImage = ({ text, onImageGenerated }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 500;
    canvas.height = 200;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Convert canvas to image URL
    const imageUrl = canvas.toDataURL('image/png');
    onImageGenerated(imageUrl);
  }, [text, onImageGenerated]);

  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};

export default TextToImage;