import { Briefcase, Heart, HouseHeart, Pencil, School, Users } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { EditTextModal, type FieldConfig } from "../../Modals/EditTextModal";
import { useState } from "react";
import { useFirebaseContent } from "../../../hooks/useFirebaseContent";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../AuthProvider/useAuth";

// 1. Налаштування анімації контейнера (керує чергою)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25, // Затримка 0.25с між появою кожної картки
    },
  },
};

// 2. Налаштування анімації окремої картки (виїзд знизу)
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50, // Початкова позиція: зміщена на 50px вниз
  },
  visible: {
    opacity: 1,
    y: 0, // Кінцева позиція: на своєму місці
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20,
    },
  },
};

const cardsConfig = [
  {
    id: "mission",
    icon: <HouseHeart />,
    className:
      "bg-Blue-2 shadow-card bg-decor relative flex flex-col gap-4 rounded-lg p-8 md:col-span-2 xl:col-span-2",
  },
  {
    id: "children",
    icon: <School />,
    className:
      "bg-Blue-2 shadow-card flex flex-col gap-4 rounded-lg p-8 md:row-start-2 xl:col-start-3 xl:row-start-1",
  },
  {
    id: "community",
    icon: <Users />,
    className:
      "bg-Blue-2 text-grey-500 shadow-card flex flex-col gap-4 rounded-lg p-8 md:row-start-2 xl:col-start-4 xl:row-start-1",
  },
  {
    id: "adults",
    icon: <Briefcase />,
    className:
      "bg-Orange-2 shadow-card flex flex-col gap-4 rounded-lg p-8 md:col-span-2 xl:col-start-1 xl:row-start-2",
  },
  {
    id: "summary",
    icon: <Heart />,
    className:
      "bg-Orange-2 shadow-card flex flex-col gap-4 rounded-lg p-8 md:col-span-2 xl:col-start-3 xl:row-start-2",
  },
];

export default function OurMission() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { getText, isLoading, data } = useFirebaseContent("home");
  const { t } = useTranslation();
  const { isAdmin } = useAuth();

  const mainTitle = getText("ourMission.title", t("ourMission.title"));

  const missionFields: FieldConfig[] = [
    { key: "title", label: "Головний заголовок секції", type: "input" },
    ...cardsConfig.flatMap((card) => [
      { key: `cards.${card.id}.title`, label: `Заголовок (${card.id})`, type: "input" as const },
      {
        key: `cards.${card.id}.subtitle`,
        label: `Підзаголовок (${card.id})`,
        type: "input" as const,
      },
      { key: `cards.${card.id}.lead`, label: `Лідабзац (${card.id})`, type: "textarea" as const },
      {
        key: `cards.${card.id}.text`,
        label: `Основний текст (${card.id})`,
        type: "textarea" as const,
      },
    ]),
  ];

  return (
    <section className="relative my-10 overflow-hidden">
      {/* Анімація заголовка */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* 👇 Кнопка-олівець для адміна */}
        {isAdmin && (
          <button
            onClick={() => setIsEditOpen(true)}
            className="absolute top-2 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-xl transition-all hover:scale-110 hover:bg-blue-600 hover:text-white"
          >
            <Pencil size={20} />
          </button>
        )}
        <h2 className="text-preset-2 font-semibold">{mainTitle}</h2>
      </motion.div>

      {/* Контейнер гріда */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }} // Почнеться, коли видно 15% секції
        className="mx-auto my-10 grid max-w-[375px] gap-8 px-4 md:grid md:max-w-full md:grid-cols-2 xl:grid-cols-4 xl:gap-y-6"
      >
        {cardsConfig.map((card) => {
          const titlePath = `ourMission.cards.${card.id}.title`;
          const subtitlePath = `ourMission.cards.${card.id}.subtitle`;
          const leadPath = `ourMission.cards.${card.id}.lead`;
          const textPath = `ourMission.cards.${card.id}.text`;

          return (
            <motion.aside key={card.id} variants={cardVariants} className={card.className}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black bg-gray-100">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-preset-3 mt-5">
                    {isLoading ? "..." : getText(titlePath, t(titlePath))}
                  </h3>
                  <p className="text-preset-5 mt-1 text-gray-400">
                    {isLoading ? "..." : getText(subtitlePath, t(subtitlePath))}
                  </p>
                </div>
              </div>
              <p className="text-preset-4">{isLoading ? "..." : getText(leadPath, t(leadPath))}</p>
              <p className="text-preset-5">{isLoading ? "..." : getText(textPath, t(textPath))}</p>
            </motion.aside>
          );
        })}
      </motion.div>

      <EditTextModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        documentName="home" // 👈 Вказуємо документ
        sectionName="ourMission" // 👈 Вказуємо секцію
        modalTitle="Редагування Our Mission" // 👈 Гарний заголовок
        initialData={data?.ourMission} // 👈 Передаємо шматочок даних з хука
        fields={missionFields}
      />
    </section>
  );
}
