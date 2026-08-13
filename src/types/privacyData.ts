import type { Timestamp } from "firebase/firestore";

export type PrivacyLanguage = "ua" | "de" | "en";

export type LocalizedPrivacyText = Record<PrivacyLanguage, string>;

export interface PrivacyData {
  summary: LocalizedPrivacyText;
  controller: LocalizedPrivacyText;
  generalProcessing: LocalizedPrivacyText;
  contactForms: LocalizedPrivacyText;
  automation: LocalizedPrivacyText;
  vpsHosting: LocalizedPrivacyText;
  googleWorkspace: LocalizedPrivacyText;
  cloudinary: LocalizedPrivacyText;
  youtube: LocalizedPrivacyText;
  cookies: LocalizedPrivacyText;
  retention: LocalizedPrivacyText;
  userRights: LocalizedPrivacyText;
  complaint: LocalizedPrivacyText;

  vpsProviderName: string;
  vpsProviderAddress: string;
  serverLocation: string;
  retentionMonths: number;

  updatedAt?: Timestamp | null;
}

export type EditablePrivacySection = Exclude<
  keyof PrivacyData,
  | "vpsProviderName"
  | "vpsProviderAddress"
  | "serverLocation"
  | "retentionMonths"
  | "updatedAt"
>;

