export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '');
  const bigint = parseInt(cleaned.length === 3 ? cleaned.split('').map((c) => c + c).join('') : cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

export function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const clamped = Math.max(0, Math.min(255, Math.round(x)));
        const hex = clamped.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

export function adjust(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + amount, g + amount, b + amount);
}

