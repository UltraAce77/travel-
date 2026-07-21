const FALLBACK_IMAGES = [
  "photo-1507525428034-b723cf961d3e",
  "photo-1493976040374-85c8e12f0c0e",
  "photo-1531366936337-7c912a4589a7",
  "photo-1523906834658-6e24ef2386f9",
  "photo-1501785888041-af3ef285b470",
  "photo-1537996194471-e657df975ab4",
];

export const fallbackTrekImage = (index = 0) =>
  `https://images.unsplash.com/${FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}?auto=format&fit=crop&w=1200&q=80`;

export function trekImage(trek, index = 0) {
  if (trek?.picture) return `data:image/jpeg;base64,${trek.picture}`;
  return trek?.imageUrl || fallbackTrekImage(index);
}

export function fallbackOnImageError(index = 0) {
  return (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackTrekImage(index);
  };
}
