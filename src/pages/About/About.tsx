import { useTranslation } from "react-i18next";
import about from "../../images/bereg-about22.jpg";
import avatar from "../../images/icons8-avatar-3d-fluency/icons8-avatar-100.png";
import partner from "../../images/icons8-penguin-color/icons8-penguin-48.png";

export const About = () => {
  const { t } = useTranslation();

  return (
    <div className="font-montserratRegular flex flex-col justify-center py-8">
      <div className="font-montserratBold flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h1 className="text-preset-2 font-montserratBold flex justify-center pb-4">
            {t("about.aboutUs")}
          </h1>{" "}
          <div className="mx-auto mb-4 h-1 w-24 bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>

        <p className="text-preset-4 flex max-w-3xl items-center justify-center px-4 leading-8 md:px-0">
          {t("about.missionDescription")}
        </p>
      </div>

      <section className="flex w-full flex-col items-center justify-center py-12 md:flex-row md:gap-6 lg:gap-8">
        <div className="mb-5 w-full max-w-120 min-w-80 px-6 md:mb-0 md:max-w-1/2">
          <h2 className="font-montserratBold text-preset-3 py-3 xl:py-4">
            {t("about.storyTitle")}
          </h2>
          <p className="font-montserratRegular text-base leading-5 md:leading-5 lg:text-lg lg:leading-5.5 xl:py-5 xl:leading-7">
            {t("about.storyContent")}
          </p>
        </div>
        <div className="max-w-120 min-w-80 overflow-hidden rounded-lg shadow-lg md:max-w-5xl">
          <img
            src={about}
            alt="About Berehynja"
            className="h-135 w-full origin-center scale-[1.6] transform object-cover"
          />
        </div>
      </section>

      <section className="flex flex-col items-center justify-center py-10">
        <div className="mb-10 max-w-full">
          <div className="mb-4 flex max-w-full flex-col items-center justify-center">
            <h2 className="font-montserratBold text-preset-3 flex flex-col items-center justify-center py-3 xl:py-4">
              {t("about.ourTeam")}
            </h2>
            <p className="text-preset-4 flex items-center justify-center px-4 leading-8 md:px-0">
              {t("about.teamContent")}
            </p>
          </div>

          <ul className="text-preset-4 grid max-w-120 list-none gap-8 leading-5 md:max-w-full md:grid-cols-2 md:leading-5 lg:grid-cols-3 lg:leading-5.5 xl:grid-cols-4 xl:py-5 xl:leading-7">
            <li className="shadow-card flex rounded-b-sm p-3">
              <img src={avatar} />
              <p>
                Олена Іваненко <br /> Засновниця та виконавча директорка
              </p>
            </li>
            <li className="shadow-card flex rounded-sm p-3">
              <img src={avatar} />
              <p>
                Марія Ковальчук <br /> Координаторка програм
              </p>
            </li>
            <li className="shadow-card flex rounded-sm p-3">
              <img src={avatar} />
              <p>
                Ірина Петренко <br /> Спеціалістка з комунікацій
              </p>
            </li>
            <li className="shadow-card flex rounded-sm p-3">
              <img src={avatar} />
              <p>
                Анна Шевченко <br /> Юридична консультантка
              </p>
            </li>
            <li className="shadow-card flex rounded-sm p-3">
              <img src={avatar} />
              <p>
                Оксана Литвин <br /> Координаторка волонтерів
              </p>
            </li>
            <li className="shadow-card flex rounded-sm p-3">
              <img src={avatar} />
              <p>
                Світлана Бондаренко <br /> Фінансовий менеджер
              </p>
            </li>
            <li className="shadow-card flex rounded-sm p-3">
              <img src={avatar} />
              <p>
                Тетяна Грищук <br /> Культурний куратор
              </p>
            </li>
            <li className="shadow-card flex rounded-sm p-3">
              <img src={avatar} />
              <p>
                Олена Грищук <br /> Психологиня
              </p>
            </li>
            <li className="shadow-card flex rounded-sm p-3">
              <img src={avatar} />
              <p>
                Вікторія Грищук <br /> Психолог
              </p>
            </li>
          </ul>
        </div>

        <div className="max-w-full">
          <h2 className="font-montserratBold text-preset-3 flex flex-col items-center justify-center py-3 xl:py-4">
            {t("about.ourPartners")}
          </h2>

          <ul className="text-preset-4 grid max-w-120 list-none gap-8 leading-5 md:max-w-full md:grid-cols-2 md:leading-5 lg:grid-cols-3 lg:leading-5.5 xl:grid-cols-4 xl:py-5 xl:leading-7">
            <li className="shadow-card flex gap-3 rounded-b-sm bg-amber-50 p-3">
              <img className="" src={partner} width="48" height="48" alt="p" />
              <p>Генеральне консульство України в Німеччині</p>
            </li>
            <li className="shadow-card flex max-h-30 gap-3 rounded-sm bg-blue-50 p-3">
              <img src={partner} width="48" height="60" alt="p" />
              <p>Міністерство закордонних справ України</p>
            </li>
            <li className="shadow-card flex gap-3 rounded-sm bg-emerald-50 p-3">
              <img src={partner} width="48" height="60" alt="p" />
              <p>Integrationamt Bad Oeynhausen</p>
            </li>
            <li className="shadow-card flex gap-3 rounded-sm bg-fuchsia-50 p-3">
              <img src={partner} width="48" height="60" alt="p" />
              <p>Plast – Ukrainischer Pfadfinderbund в Німеччин</p>
            </li>
            <li className="shadow-card flex gap-3 rounded-sm bg-indigo-50 p-3">
              <img src={partner} width="48" height="60" alt="p" />
              <p>Українська суботня школа в Гамбурзі</p>
            </li>
            <li className="shadow-card flex gap-3 rounded-sm bg-pink-50 p-3">
              <img src={partner} width="48" height="60" alt="p" />
              <p>Міжнародний фонд «Відродження»</p>
            </li>
          </ul>
        </div>
      </section>

      <p>Статут PDF</p>
    </div>
  );
};
