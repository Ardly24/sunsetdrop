
export function validatePhotos(
  files: File[],
  remainingSlots: number,
): string | null {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (files.length > remainingSlots) {
    return `You can only add ${remainingSlots} more photo(s).`;
  }

  if (files.some((file) => !allowedTypes.includes(file.type))) {
    return "Only JPEG, PNG, and WebP images are allowed.";
  }

  if (files.some((file) => file.size > 5 * 1024 * 1024)) {
    return "Each image must not exceed 5 MB.";
  }

  return null;
}