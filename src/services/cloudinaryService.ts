const CLOUD_NAME = "dhyjsid8j";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

export type MediaCategory = 'events' | 'team' | 'programs' | 'partners' | 'banners';

interface UploadResponse {
  url: string;
  public_id: string;
}

export const uploadMedia = async (
  file: File, 
  category: MediaCategory, 
  subFolder?: string
): Promise<UploadResponse> => {
  
  const formData = new FormData();
  formData.append("file", file);

  // Названия пресетов должны точно совпадать с теми, что в Cloudinary Settings -> Upload
  const presets: Record<MediaCategory, string> = {
    events: "event_photos",
    team: "team_photos",
    programs: "program_photos", 
    partners: "partner_photos",
    banners: "banner_photos",
  };

  formData.append("upload_preset", presets[category]);

  // Формируем папку: например "programs/math_course"
  const path = subFolder ? `${category}/${subFolder}` : category;
  formData.append("folder", path);

  try {
    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Ошибка при загрузке в Cloudinary");
    }

    const data = await response.json();
    
    return {
      url: data.secure_url,
      public_id: data.public_id
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

