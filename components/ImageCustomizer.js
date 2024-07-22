// components/ImageCustomizer.js
import React from 'react';

const ImageCustomizer = ({ backgroundColor, setBackgroundColor, fontColor, setFontColor, font, setFont }) => {
  const fonts = ['Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier', 'Comic Sans MS'];

  return (
    <div className="mt-4 space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Background Color</label>
          <div className="mt-1 flex items-center">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-8 h-8 rounded-full"
            />
            <span className="ml-2 text-sm text-gray-500">{backgroundColor}</span>
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Font Color</label>
          <div className="mt-1 flex items-center">
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="w-8 h-8 rounded-full"
            />
            <span className="ml-2 text-sm text-gray-500">{fontColor}</span>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Font</label>
        <select
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {fonts.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ImageCustomizer;