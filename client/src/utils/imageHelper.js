/**
 * Universal Image Resolver for FoodResQ
 * Handles external URLs, local public assets, and backend uploads gracefully
 */
export const getFoodImageUrl = (image, category = '', foodName = '') => {
  // If it's already an absolute HTTP/HTTPS URL, return directly
  if (image && typeof image === 'string') {
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    if (image.startsWith('/images/')) {
      return image;
    }

    // If it's stored as /uploads/filename.jpg
    if (image.startsWith('/uploads/')) {
      const filename = image.replace('/uploads/', '');
      const knownLocalImages = [
        'tamil_biryani.jpg',
        'tamil_meals.jpg',
        'sambar_sadham.jpg',
        'idli.jpg',
        'dosa.jpg',
        'pongal.jpg',
        'parotta.jpg',
        'vada_sambar.jpg',
        'bakery.jpg',
        'curry_rice.jpg',
        'fruits.jpg',
        'vegetables.jpg',
        'bread_loaves.jpg',
        'croissants_pastries.jpg',
        'appalam.jpg',
        'sundal.jpg',
      ];
      if (knownLocalImages.includes(filename)) {
        return `/images/${filename}`;
      }

      const apiUrl = import.meta.env.VITE_API_URL || '';
      if (apiUrl) {
        const serverBase = apiUrl.replace(/\/api\/?$/, '');
        return `${serverBase}${image}`;
      }
      return `/images/${filename}`;
    }
  }

  // Name keyword matching
  const nameLower = (foodName || '').toLowerCase();
  if (nameLower.includes('biryani')) return '/images/tamil_biryani.jpg';
  if (nameLower.includes('meals') || nameLower.includes('saapadu') || nameLower.includes('thali')) return '/images/tamil_meals.jpg';
  if (nameLower.includes('sambar') && nameLower.includes('rice')) return '/images/sambar_sadham.jpg';
  if (nameLower.includes('idli')) return '/images/idli.jpg';
  if (nameLower.includes('dosa') || nameLower.includes('dosai')) return '/images/dosa.jpg';
  if (nameLower.includes('pongal')) return '/images/pongal.jpg';
  if (nameLower.includes('parotta') || nameLower.includes('roti')) return '/images/parotta.jpg';
  if (nameLower.includes('vada')) return '/images/vada_sambar.jpg';
  if (nameLower.includes('bread') || nameLower.includes('bun') || nameLower.includes('bakery')) return '/images/bakery.jpg';
  if (nameLower.includes('fruit') || nameLower.includes('banana')) return '/images/fruits.jpg';
  if (nameLower.includes('vegetable')) return '/images/vegetables.jpg';

  // Category map fallback
  const categoryMap = {
    'Tamil Nadu Traditional': '/images/tamil_meals.jpg',
    'South Indian Specials': '/images/dosa.jpg',
    'Cooked Meals': '/images/curry_rice.jpg',
    'Prepared Meals': '/images/curry_rice.jpg',
    'Bakery': '/images/bakery.jpg',
    'Bakery & Bread': '/images/bakery.jpg',
    'Fruits': '/images/fruits.jpg',
    'Vegetables': '/images/vegetables.jpg',
    'Fruits & Vegetables': '/images/fruits-vegetables.jpg',
    'Produce': '/images/fruits.jpg',
    'Dairy & Sweets': '/images/pongal.jpg',
    'Packaged Food': '/images/packaged-food.jpg',
  };

  return categoryMap[category] || '/images/tamil_meals.jpg';
};

export const handleImageError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = '/images/tamil_meals.jpg';
};
