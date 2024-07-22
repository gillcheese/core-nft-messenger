// components/TextToImage.js
import React, { useRef, useEffect } from 'react';

const TextToImage = ({ text, onImageGenerated, backgroundColor, fontColor, font }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size (1:1 aspect ratio)
    const size = 500; // You can adjust this value
    canvas.width = size;
    canvas.height = size;

    // Clear canvas with selected background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.fillStyle = fontColor;
    ctx.font = `24px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Word wrap function
    function wrapText(text, maxWidth) {
      let words = text.split(' ');
      let lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }

    // Draw wrapped text
    const maxWidth = canvas.width - 40; // Leaving some padding
    const lineHeight = 30;
    const lines = wrapText(text, maxWidth);
    const totalTextHeight = lines.length * lineHeight;
    let startY = (canvas.height - totalTextHeight) / 2;

    lines.forEach(line => {
      ctx.fillText(line, canvas.width / 2, startY);
      startY += lineHeight;
    });

    // Convert canvas to image URL
    const imageUrl = canvas.toDataURL('image/png');
    onImageGenerated(imageUrl);
  }, [text, onImageGenerated, backgroundColor, fontColor, font]);

  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};

export default TextToImage;