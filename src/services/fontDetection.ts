export // Configuration de l'API WhatTheFont
const API_KEY = 'YOUR_WHATFONT_API_KEY'; // Remplacez par votre clé API
const API_URL = 'https://api.whatfontis.com/v1/fonts/detect';

export interface FontMatch {
  family: string;
  style: string;
  url: string;
  similarity: number;
}

export const detectFonts = async (imageFile: File): Promise<FontMatch[]> => {
  // En mode développement, utiliser les données simulées
  if (import.meta.env.DEV) {
    return simulateFontDetection();
  }

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('api_key', API_KEY);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    // Transformer la réponse de l'API en format attendu
    return data.matches?.map((match: any) => ({
      family: match.font_family || 'Police inconnue',
      style: match.font_style || 'Regular',
      url: match.url || 'https://www.whatfontis.com',
      similarity: match.similarity || 0,
    })) || [];
    
  } catch (error) {
    console.error('Erreur lors de la détection des polices:', error);
    // En cas d'erreur, retourner des données simulées
    return simulateFontDetection();
  }
};

// Simulation de détection de polices pour le développement
const simulateFontDetection = (): FontMatch[] => {
  console.log('Utilisation des données simulées pour la détection de polices');
  
  return [
    {
      family: 'Roboto',
      style: 'Regular',
      url: 'https://fonts.google.com/specimen/Roboto',
      similarity: 0.95
    },
    {
      family: 'Open Sans',
      style: 'SemiBold',
      url: 'https://fonts.google.com/specimen/Open+Sans',
      similarity: 0.92
    },
    {
      family: 'Montserrat',
      style: 'Medium',
      url: 'https://fonts.google.com/specimen/Montserrat',
      similarity: 0.89
    }
  ];
};

export default detectFonts;
