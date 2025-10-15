import { useState, useCallback } from 'react';
import ColorThief from 'colorthief';
import { Palette, Upload, Copy, Check, X } from 'lucide-react';

interface Color {
  rgb: [number, number, number];
  hex: string;
  hsl: string;
}

function App() {
  const [image, setImage] = useState<string>('');
  const [colors, setColors] = useState<Color[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string>('');

  // Conversion RGB vers HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  // Conversion RGB vers HSL
  const rgbToHsl = (r: number, g: number, b: number): string => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  // Extraction des couleurs
  const extractColors = useCallback(async (dataUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = dataUrl;
    });

    const colorThief = new ColorThief();
    const palette = colorThief.getPalette(img, 6);
    
    const extractedColors: Color[] = palette.map(([r, g, b]) => ({
      rgb: [r, g, b],
      hex: rgbToHex(r, g, b),
      hsl: rgbToHsl(r, g, b),
    }));
    
    setColors(extractedColors);
  }, []);

  // Gestion de l'upload
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Fichier trop volumineux (max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImage(dataUrl);
      extractColors(dataUrl);
    };
    reader.readAsDataURL(file);
  }, [extractColors]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  // Copier dans le presse-papier
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  // Couleur de texte contrastée
  const getTextColor = (r: number, g: number, b: number) => {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#000' : '#fff';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center justify-center mb-6">
            <img 
              src="logo-with color.png" 
              alt="Dispoz" 
              className="w-32 h-32 object-contain"
            />
          </div>
          <p className="text-lg text-slate-600">
            Extrayez une palette de couleurs depuis n'importe quelle image
          </p>
        </div>

        {/* Zone d'upload */}
        {!image ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all ${
              isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 'border-slate-300 hover:border-blue-400'
            }`}
          >
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <div className={`p-6 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-slate-100'}`}>
                <Upload className={`w-12 h-12 ${isDragging ? 'text-blue-600' : 'text-slate-400'}`} />
              </div>
              <p className="text-lg font-semibold text-slate-700">
                {isDragging ? 'Déposez votre image ici' : 'Glissez-déposez votre image'}
              </p>
              <label
                htmlFor="file-input"
                className="shine-effect px-6 py-3 text-white font-semibold rounded-full cursor-pointer transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Parcourir les fichiers
              </label>
              <p className="text-sm text-slate-400">JPG, PNG ou WebP • Max 5MB</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Image uploadée */}
            <div className="relative w-full max-w-md mx-auto">
              <img src={image} alt="Uploaded" className="w-full h-64 object-cover rounded-xl shadow-lg" />
              <button
                onClick={() => { setImage(''); setColors([]); }}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>

            {/* Palette de couleurs */}
            {colors.length > 0 && (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Palette extraite</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {colors.map((color, idx) => (
                      <div key={idx} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                        <div className="h-24" style={{ backgroundColor: color.hex }} />
                        <div className="p-3 space-y-2">
                          {[
                            { label: 'HEX', value: color.hex },
                            { label: 'RGB', value: `rgb(${color.rgb.join(', ')})` },
                            { label: 'HSL', value: color.hsl },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                              <div>
                                <span className="text-[10px] font-medium text-slate-500">{label}</span>
                                <code className="block text-xs font-mono text-slate-700 truncate">{value}</code>
                              </div>
                              <button
                                onClick={() => copyToClipboard(value)}
                                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                              >
                                {copiedCode === value ? (
                                  <Check className="w-3.5 h-3.5 text-green-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview UI */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Aperçu de la palette</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Boutons */}
                    <div className="bg-white rounded-3xl p-6 shadow-lg">
                      <h3 className="text-lg font-semibold text-slate-700 mb-4">Boutons</h3>
                      <div className="space-y-3">
                        {colors.slice(0, 3).map((color, idx) => (
                          <button
                            key={idx}
                            className="w-full px-6 py-3 rounded-full font-medium transition-transform hover:scale-105"
                            style={{
                              backgroundColor: color.hex,
                              color: getTextColor(...color.rgb),
                            }}
                          >
                            Bouton {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Card */}
                    <div
                      className="rounded-3xl p-6 shadow-lg"
                      style={{ backgroundColor: colors[0].hex }}
                    >
                      <h3
                        className="text-lg font-semibold mb-3"
                        style={{ color: getTextColor(...colors[0].rgb) }}
                      >
                        Card colorée
                      </h3>
                      <p
                        className="mb-4 opacity-90"
                        style={{ color: getTextColor(...colors[0].rgb) }}
                      >
                        Exemple de texte sur un fond coloré avec contraste automatique.
                      </p>
                      <button
                        className="px-4 py-2 rounded-full font-medium"
                        style={{
                          backgroundColor: colors[1]?.hex || '#fff',
                          color: getTextColor(...(colors[1]?.rgb || [255, 255, 255])),
                        }}
                      >
                        Action
                      </button>
                    </div>

                    {/* Texte */}
                    <div className="bg-white rounded-3xl p-6 shadow-lg md:col-span-2">
                      <h3 className="text-lg font-semibold text-slate-700 mb-4">Typographie</h3>
                      <div className="space-y-2">
                        {colors.slice(0, 4).map((color, idx) => (
                          <p
                            key={idx}
                            className="text-lg font-medium"
                            style={{ color: color.hex }}
                          >
                            Exemple de texte avec la couleur {idx + 1}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
