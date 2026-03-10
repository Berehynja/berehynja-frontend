import { Heart, Users, BookOpen, Calendar, Pencil } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFirebaseContent } from "../../hooks/useFirebaseContent";
import { EditTextModal, type FieldConfig } from "../Modals/EditTextModal";
import { useAuth } from "../AuthProvider/useAuth";

// 1. Конфігурація карток (тільки ID, іконки та стилі)
const featuresConfig = [
  {
    id: "support",
    Icon: Heart,
    borderColor: "border-t-Blue",
    iconColor: "text-Blue",
  },
  {
    id: "community",
    Icon: Users,
    borderColor: "border-t-Green",
    iconColor: "text-Green",
  },
  {
    id: "integration",
    Icon: BookOpen,
    borderColor: "border-t-Orange",
    iconColor: "text-Orange",
  },
  {
    id: "events",
    Icon: Calendar,
    borderColor: "border-t-Red",
    iconColor: "text-Red",
  },
];

// 2. Налаштування анімації
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20,
    },
  },
};

export function HowWeHelp() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { getText, isLoading, data } = useFirebaseContent("home");
  const { t } = useTranslation();
  const { isAdmin } = useAuth();

  // Дістаємо головний заголовок
  const mainTitle = getText("howWeHelp.title", t("howWeHelp.title"));

  // 3. Динамічно генеруємо поля для модалки (Заголовок + 4 картки по 2 поля)
  const helpFields: FieldConfig[] = [
    { key: "title", label: "Головний заголовок секції", type: "input" },
    ...featuresConfig.flatMap((card) => [
      { key: `cards.${card.id}.title`, label: `Заголовок (${card.id})`, type: "input" as const },
      {
        key: `cards.${card.id}.description`,
        label: `Опис (${card.id})`,
        type: "textarea" as const,
      },
    ]),
  ];

  return (
    <section className="relative my-6 overflow-hidden">
      <div className="relative mx-auto max-w-[375px] px-4 py-6 md:max-w-full">
        {/* Анімація заголовка */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative text-center"
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

          <h2 className="text-preset-2 mt-0.5 font-semibold xl:mt-2.5">
            {isLoading ? "..." : mainTitle}
          </h2>
        </motion.div>

        {/* Контейнер карток з анімацією */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4"
        >
          {featuresConfig.map((item) => {
            // Динамічно формуємо шляхи для кожної картки
            const titlePath = `howWeHelp.cards.${item.id}.title`;
            const descPath = `howWeHelp.cards.${item.id}.description`;

            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                className={`shadow-card relative h-[250px] w-full rounded-sm border-t-4 bg-white px-8 py-7 ${item.borderColor}`}
              >
                <h3 className="text-preset-3 font-semibold">
                  {isLoading ? "..." : getText(titlePath, t(titlePath))}
                </h3>
                <p className="text-preset-5 mt-5 font-light">
                  {isLoading ? "..." : getText(descPath, t(descPath))}
                </p>

                {/* Кружечок з іконкою */}
                <div
                  className={`absolute right-8 bottom-8 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 ${item.iconColor}`}
                >
                  <item.Icon className="h-6 w-6" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* 👇 Підключаємо універсальну модалку */}
      <EditTextModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        documentName="home"
        sectionName="howWeHelp"
        modalTitle="Редагування 'Як ми допомагаємо'"
        initialData={data?.howWeHelp as Record<string, unknown>}
        fields={helpFields}
      />
    </section>
  );
}
