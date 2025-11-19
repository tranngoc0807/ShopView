'use client';

import { useState } from 'react';

interface ColorSelectorProps {
  colors: string[];
  onColorSelect?: (color: string) => void;
}

export default function ColorSelector({ colors, onColorSelect }: ColorSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || '');

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorSelect?.(color);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Màu sắc ({colors.length} màu)
      </h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color: string, index: number) => (
          <button
            key={index}
            onClick={() => handleColorChange(color)}
            className={`px-4 py-2 border-2 rounded-lg transition ${
              selectedColor === color
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 hover:border-gray-900'
            }`}
          >
            {color}
          </button>
        ))}
      </div>
      {selectedColor && (
        <p className="text-sm text-gray-600 mt-3">
          Đã chọn: <span className="font-semibold">{selectedColor}</span>
        </p>
      )}
    </div>
  );
}
