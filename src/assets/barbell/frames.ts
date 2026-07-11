// Auto-generated barrel file for barbell frame sequence
const modules = import.meta.glob<{ default: string }>('./*.jpg', { eager: true });

export const BARBELL_FRAMES: string[] = Object.keys(modules)
  .sort()
  .map((key) => modules[key].default);
