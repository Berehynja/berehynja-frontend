const CLOUD_NAME = "dhyjsid8j";

const UPLOAD_BASE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;

export type MediaCategory =
  | "events"
  | "team"
  | "programs"
  | "partners"
  | "banners"
  | "documents";

interface UploadResponse {
  url: string;
  public_id: string;
}

export const uploadMedia = async (
  file: File,
  category: MediaCategory,
  subFolder?: string,
  resourceType: "image" | "raw" = "image",
): Promise<UploadResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const presets: Record<MediaCategory, string> = {
    events: "event_photos",
    team: "team_photos",
    programs: "program_photos",
    partners: "partner_photos",
    banners: "banner_photos",
    documents: "doc_preset",
  };

  formData.append("upload_preset", presets[category]);

  const path = subFolder ? `${category}/${subFolder}` : category;
  formData.append("folder", path);

  const url = `${UPLOAD_BASE_URL}/${resourceType}/upload`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error?.message || "Помилка завантаження в Cloudinary",
      );
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      public_id: data.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

/**
 * Додає трансформації до URL зображення Cloudinary.
 * Для звичайних або локальних URL повертає оригінальне значення.
 */
export const optimizeCloudinaryImage = (
  url: string,
  transformation: string,
): string => {
  if (
    !url ||
    !url.includes("res.cloudinary.com") ||
    !url.includes("/image/upload/")
  ) {
    return url;
  }

  return url.replace(
    "/image/upload/",
    `/image/upload/${transformation}/`,
  );
};