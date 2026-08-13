import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "../firebase";
import type { PrivacyData } from "../types/privacyData";

const privacyDocRef = doc(db, "settings", "privacy");

export const subscribeToPrivacy = (
  callback: (data: PrivacyData | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  return onSnapshot(
    privacyDocRef,
    (snapshot) => {
      callback(snapshot.exists() ? (snapshot.data() as PrivacyData) : null);
    },
    (error) => {
      console.error("Privacy subscription error:", error);
      onError?.(error);
    },
  );
};

export const savePrivacy = async (data: PrivacyData): Promise<void> => {
  await setDoc(
    privacyDocRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

