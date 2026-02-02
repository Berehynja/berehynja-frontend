const CLOUD_NAME = "dhyjsid8j";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

// Типы для категорий, чтобы не ошибиться в буквах
export type MediaCategory = 'events' | 'team' | 'programs' | 'partners' | 'banners';

interface UploadResponse {
  url: string;
  public_id: string;
}

/**
 * 1. ДОБАВЛЕНИЕ (ЗАГРУЗКА)
 * @param file - Файл из input
 * @param category - Категория (для выбора пресета)
 * @param subFolder - Дополнительная папка (например, eventId)
 */
export const uploadMedia = async (
  file: File, 
  category: MediaCategory, 
  subFolder?: string
): Promise<UploadResponse> => {
  console.log("🚀 ~ subFolder:", subFolder)
  
  const formData = new FormData();
  formData.append("file", file);

  // Названия пресетов из твоей админки Cloudinary
  const presets: Record<MediaCategory, string> = {
    events: "event_photos", // замени на свои реальные имена
    team: "team_photos",
    programs: "program_photos",
    partners: "partner_photos",
    banners: "banner_photos",

  };

  formData.append("upload_preset", presets[category]);

  // Если передали subFolder, строим путь: category/subFolder
  const path = subFolder ? `${category}/${subFolder}` : category;
  console.log("🚀 ~ path:", path)
  formData.append("folder", path);

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Upload failed");
  }

  const data = await response.json();
  
  return {
    url: data.secure_url,
    public_id: data.public_id // Важно сохранить его для удаления!
  };
};

