declare module 'colorthief' {
  interface RGBColor {
    0: number;
    1: number;
    2: number;
  }

  export default class ColorThief {
    getColor(sourceImage: HTMLImageElement): RGBColor;
    getPalette(sourceImage: HTMLImageElement, colorCount?: number): RGBColor[];
  }
}
