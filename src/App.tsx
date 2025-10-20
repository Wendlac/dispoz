import { useState, useCallback } from 'react';
import ColorThief from 'colorthief';
import { Upload, Copy, Check, X, Palette, Layout } from 'lucide-react';

// URL directe du logo sur GitHub
const logoUrl = 'https://raw.githubusercontent.com/Wendlac/dispoz/main/public/logo-with%20color.png';

type ClassificationType = 'graphic' | 'ui';
type UiColorRole = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';

interface Color {
  rgb: [number, number, number];
  hex: string;
  hsl: string;
  role?: UiColorRole | string;
  [Symbol.iterator](): Iterator<number>;
}

function App() {
  const [image, setImage] = useState<string>('');
  const [colors, setColors] = useState<Color[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string>('');
  const [classificationType, setClassificationType] = useState<ClassificationType>('graphic');
  
  // État pour la personnalisation de la carte
  const [cardCustomization, setCardCustomization] = useState({
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    buttonColor: '#3b82f6',
    buttonTextColor: '#ffffff',
    customizing: false
  });

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

  // Classification des couleurs pour le design UI
  const classifyUiColors = useCallback((colorsToClassify: Color[]): Color[] => {
    if (colorsToClassify.length === 0) return [];
    
    // Trier les couleurs par luminosité
    const sortedByLuminance = [...colorsToClassify].sort((a, b) => {
      const [r1, g1, b1] = a.rgb;
      const [r2, g2, b2] = b.rgb;
      const luminance1 = (0.299 * r1 + 0.587 * g1 + 0.114 * b1) / 255;
      const luminance2 = (0.299 * r2 + 0.587 * g2 + 0.114 * b2) / 255;
      return luminance2 - luminance1; // Du plus clair au plus foncé
    });

    // Définir les rôles en fonction de la position dans la palette triée
    const uiRoles: UiColorRole[] = ['primary', 'secondary', 'accent', 'success', 'warning', 'error'];
    
    return sortedByLuminance.map((color, index) => ({
      ...color,
      role: uiRoles[index] || 'neutral'
    }));
  }, []);

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
    const palette = colorThief.getPalette(img, 6) as Array<[number, number, number]>;
    
    let extractedColors = palette.map((colorArray) => {
      const [r, g, b] = colorArray;
      const color = {
        rgb: [r, g, b] as [number, number, number],
        hex: rgbToHex(r, g, b),
        hsl: rgbToHsl(r, g, b),
        [Symbol.iterator]: function*() {
          yield this.rgb[0];
          yield this.rgb[1];
          yield this.rgb[2];
        }
      };
      return color as Color;
    });
    
    // Appliquer la classification si nécessaire
    if (classificationType === 'ui') {
      extractedColors = classifyUiColors(extractedColors);
    }
    
    setColors(extractedColors);
  }, [classificationType, classifyUiColors]);

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

  // Gestion du changement de type de classification
  const handleClassificationChange = (type: ClassificationType) => {
    setClassificationType(type);
    if (colors.length > 0) {
      if (type === 'ui') {
        setColors(prevColors => classifyUiColors(prevColors));
      } else {
        // Réinitialiser les rôles pour le mode graphique
        setColors(prevColors => prevColors.map(({ role, ...rest }) => rest as Color));
      }
    }
  };

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

  // Traductions des rôles UI
  const getUiRoleLabel = (role?: string): string => {
    const translations: Record<string, string> = {
      'primary': 'Primaire',
      'secondary': 'Secondaire',
      'accent': 'Accent',
      'success': 'Succès',
      'warning': 'Avertissement',
      'error': 'Erreur',
      'neutral': 'Neutre'
    };
    return role ? translations[role] || role : '';
  };

  // Gestion du changement des couleurs de personnalisation
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardCustomization(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Bascher le mode de personnalisation
  const toggleCustomization = () => {
    setCardCustomization(prev => ({
      ...prev,
      customizing: !prev.customizing
    }));
  };

  // Appliquer une couleur de la palette à un élément
  const applyColor = (colorHex: string, target: keyof typeof cardCustomization) => {
    setCardCustomization(prev => ({
      ...prev,
      [target]: colorHex
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex flex-col items-center justify-center mb-4 md:mb-6">
            <img 
              src={logoUrl} 
              alt="Dispoz" 
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
            />
          </div>
          <p className="text-base md:text-lg text-slate-600">
            Extrayez une palette de couleurs depuis n'importe quelle image
          </p>
        </div>

        {/* Sélecteur de classification */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => handleClassificationChange('graphic')}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                classificationType === 'graphic' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Palette className="w-4 h-4 mr-2" />
              Graphisme
            </button>
            <button
              onClick={() => handleClassificationChange('ui')}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                classificationType === 'ui' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Layout className="w-4 h-4 mr-2" />
              UI Design
            </button>
          </div>
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
                    {colors.map((color, idx) => {
                      const textColor = getTextColor(...color.rgb);
                      const displayRole = classificationType === 'ui' && color.role;
                      
                      return (
                        <div key={idx} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                          {displayRole && (
                            <div 
                              className="h-2 w-full" 
                              style={{ backgroundColor: color.hex }}
                            />
                          )}
                          <div 
                            className={`h-20 ${displayRole ? 'mt-0' : 'h-24'}`} 
                            style={{ 
                              backgroundColor: color.hex,
                              color: textColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: displayRole ? '0.75rem' : '0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              padding: '0.5rem',
                              textAlign: 'center',
                              textShadow: textColor === '#fff' ? '0 1px 2px rgba(0,0,0,0.2)' : '0 1px 2px rgba(255,255,255,0.2)'
                            }}
                          >
                            {displayRole && getUiRoleLabel(color.role)}
                          </div>
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
                      );
                    })}
                  </div>
                </div>

                {/* Preview UI */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Aperçu de la palette</h2>
                    <button
                      onClick={toggleCustomization}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-200 transition-colors"
                    >
                      <Palette className="w-4 h-4" />
                      {cardCustomization.customizing ? 'Masquer les options' : 'Personnaliser'}
                    </button>
                  </div>
                  
                  {cardCustomization.customizing && (
                    <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Personnalisation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Couleur de fond</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              name="backgroundColor"
                              value={cardCustomization.backgroundColor}
                              onChange={handleColorChange}
                              className="w-10 h-10 rounded cursor-pointer"
                            />
                            <div className="flex-1 grid grid-cols-4 gap-1">
                              {colors.slice(0, 4).map((color) => (
                                <button
                                  key={color.hex}
                                  className="h-8 rounded-md border border-gray-200"
                                  style={{ backgroundColor: color.hex }}
                                  onClick={() => applyColor(color.hex, 'backgroundColor')}
                                  title={`Appliquer ${color.hex}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Couleur du texte</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              name="textColor"
                              value={cardCustomization.textColor}
                              onChange={handleColorChange}
                              className="w-10 h-10 rounded cursor-pointer"
                            />
                            <div className="flex-1 grid grid-cols-4 gap-1">
                              {colors.slice(0, 4).map((color) => (
                                <button
                                  key={`text-${color.hex}`}
                                  className="h-8 rounded-md border border-gray-200"
                                  style={{ backgroundColor: color.hex }}
                                  onClick={() => applyColor(color.hex, 'textColor')}
                                  title={`Appliquer ${color.hex}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Couleur du bouton</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              name="buttonColor"
                              value={cardCustomization.buttonColor}
                              onChange={handleColorChange}
                              className="w-10 h-10 rounded cursor-pointer"
                            />
                            <div className="flex-1 grid grid-cols-4 gap-1">
                              {colors.slice(0, 4).map((color) => (
                                <button
                                  key={`btn-${color.hex}`}
                                  className="h-8 rounded-md border border-gray-200"
                                  style={{ backgroundColor: color.hex }}
                                  onClick={() => applyColor(color.hex, 'buttonColor')}
                                  title={`Appliquer ${color.hex}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Couleur du texte du bouton</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              name="buttonTextColor"
                              value={cardCustomization.buttonTextColor}
                              onChange={handleColorChange}
                              className="w-10 h-10 rounded cursor-pointer"
                            />
                            <div className="flex-1 grid grid-cols-4 gap-1">
                              <button
                                className="h-8 rounded-md border border-gray-200 bg-white"
                                onClick={() => applyColor('#ffffff', 'buttonTextColor')}
                                title="Blanc"
                              />
                              <button
                                className="h-8 rounded-md border border-gray-200 bg-gray-900"
                                onClick={() => applyColor('#111827', 'buttonTextColor')}
                                title="Noir"
                              />
                              {colors.slice(0, 2).map((color) => (
                                <button
                                  key={`btn-text-${color.hex}`}
                                  className="h-8 rounded-md border border-gray-200"
                                  style={{ backgroundColor: getTextColor(...color.rgb) }}
                                  onClick={() => applyColor(getTextColor(...color.rgb), 'buttonTextColor')}
                                  title={`Contraste de ${color.hex}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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

                    {/* Card personnalisable */}
                    <div
                      className="rounded-3xl p-6 shadow-lg transition-colors duration-300"
                      style={{ 
                        backgroundColor: cardCustomization.backgroundColor,
                        color: cardCustomization.textColor
                      }}
                    >
                      <h3
                        className="text-lg font-semibold mb-3"
                      >
                        Titre de la carte
                      </h3>
                      <p
                        className="mb-4 opacity-90"
                      >
                        Ceci est un exemple de texte qui s'affiche sur la carte. Vous pouvez personnaliser les couleurs à votre guise.
                      </p>
                      <button
                        className="px-4 py-2 rounded-full font-medium transition-colors hover:opacity-90"
                        style={{
                          backgroundColor: cardCustomization.buttonColor,
                          color: cardCustomization.buttonTextColor
                        }}
                      >
                        Bouton d'action
                      </button>
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
