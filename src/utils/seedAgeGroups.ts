import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const AGE_GROUPS_DATA = [
  // основні групи
  { id: "age_3_5", label: "3-5 років", order: 1 },
  { id: "age_6_11", label: "6-11 років", order: 2 },
  { id: "age_12_18", label: "12-18 років", order: 3 },

  // підгрупи
  {
    id: "age_6_11_7_9",
    label: "6-11 років",
    subLabel: "7-9 років",
    parentId: "age_6_11",
    order: 4,
  },
  {
    id: "age_6_11_8_12",
    label: "6-11 років",
    subLabel: "8-12 років",
    parentId: "age_6_11",
    order: 5,
  },
];

export const seedAgeGroups = async () => {
  try {
    console.log("Починаємо створювати вікових груп...");

    for (const group of AGE_GROUPS_DATA) {
      // Використовуємо setDoc, щоб ми самі задавали ID документа (group.id),
      // а не отримували випадковий набір символів від Firebase
      await setDoc(doc(db, "ageGroups", group.id), group);
      console.log(`Група ${group.id} створена`);
    }

    console.log("Вікові групи успішно створені.");
    window.alert("Вікові групи успішно створені.");
  } catch (error) {
    console.error("Помилка при створенні вікових груп:", error);
    window.alert("Помилка при створенні вікових груп. Перевірте консоль для деталей.");
  }
};
