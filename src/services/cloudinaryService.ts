const CLOUD_NAME = "dhyjsid8j";

const UPLOAD_BASE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;

export type MediaCategory =
  | "events"
  | "team"
  | "programs"
  | "partners"
  | "banners"
  | "mobileBanners"
  | "documents";

interface UploadResponse {
  url: string;
  public_id: string;
}

interface UploadConfiguration {
  preset: string;
  folder: string;
}

const UPLOAD_CONFIG: Record<MediaCategory, UploadConfiguration> = {
  events: {
    preset: "event_photos",
    folder: "events",
  },
  team: {
    preset: "team_photos",
    folder: "team",
  },
  programs: {
    preset: "program_photos",
    folder: "programs",
  },
  partners: {
    preset: "partner_photos",
    folder: "partners",
  },
  banners: {
    preset: "banner_photos",
    folder: "banners",
  },
  mobileBanners: {
    preset: "mobile_banner_photos",
    folder: "banners/mobile",
  },
  documents: {
    preset: "doc_preset",
    folder: "documents",
  },
};

export const uploadMedia = async (
  file: File,
  category: MediaCategory,
  subFolder?: string,
  resourceType: "image" | "raw" = "image",
): Promise<UploadResponse> => {
  const configuration = UPLOAD_CONFIG[category];
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", configuration.preset);

  const folder = subFolder
    ? `${configuration.folder}/${subFolder}`
    : configuration.folder;

  formData.append("folder", folder);

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
 * Adds delivery transformations only to Cloudinary image URLs.
 * Local and third-party URLs are returned unchanged.
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
