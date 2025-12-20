import about from "../../images/bereg-about22.jpg";
import avatar from "../../images/icons8-avatar-3d-fluency/icons8-avatar-100.png";
import partner from "../../images/icons8-penguin-color/icons8-penguin-48.png";


export const About = () => {
  return (
    <div className="flex flex-col justify-center font-montserratRegular py-8">
      <div
        className="flex flex-col justify-center items-center gap-8 py-7 md:py-10 font-montserratBold 
      md:flex-row "
      >
        <div className="max-w-4xl ">
          <h1 className="flex text-4xl md:text-5xl  font-montserratBold py-4 justify-center ">
            Про Berehynja{" "}
          </h1>{" "}
          <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-yellow-400 mx-auto mb-4"></div>
        </div>

        <p className="flex justify-center items-center max-w-3xl text-lg px-4 md:text-xl md:px-0 leading-8">
          Громадська організація, присвячена підтримці української спільноти у
          їхній подорожі до адаптації та інтеграції в Німеччині.
        </p>
      </div>

      <section className="flex w-full flex-col md:flex-row justify-center items-center md:gap-6 lg:gap-8 py-12 ">
        <div className="min-w-80 max-w-120 md:max-w-1/2 h-130  px-6  rounded-lg shadow-lg">
          <h2 className="font-montserratBold text-2xl py-3 xl:py-4">
            Історія команди
          </h2>
          <p className="font-montserratRegular text-base lg:text-lg leading-5 md:leading-5 lg:leading-5.5 xl:leading-7 xl:py-5">
            {" "}
            BEREHYNJA була заснована у відповідь на зростаючу потребу в
            підтримці українців у Німеччині. Наша назва походить від
            українського слова "берегиня" (захисник), що відображає нашу
            прихильність до захисту та піклування нашою громадою. Те, що
            почалося як невелика група волонтерів, виросло в комплексну
            організацію підтримки, що пропонує все від мовних курсів до
            культурних заходів, правової допомоги до консультацій щодо
            працевлаштування. Ми вважаємо, що успішна інтеграція не означає
            втрату своєї ідентичності. Наші програми розроблені, щоб допомогти
            біженцям побудувати нове життя в Німеччині, одночасно святкуючи й
            зберігаючи українську культуру та традиції.
          </p>
        </div>
        <div className="min-w-80 max-w-120 md:max-w-5xl rounded-lg shadow-lg overflow-hidden">
          <img
            src={about}
            alt="About Berehynja"
            className="w-full h-130 object-cover transform scale-[1.6] origin-center"
          />
        </div>
      </section>

      <section className="flex flex-col justify-center items-center py-10">
        <div className="max-w-full mb-10">
          <h2 className="flex flex-col justify-center items-center font-montserratBold text-2xl py-3 xl:py-4">
            Наша команда
          </h2>
          <ul className="max-w-120 md:max-w-full grid  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 list-none text-base lg:text-lg leading-5 md:leading-5 lg:leading-5.5 xl:leading-7 xl:py-5">
            <li className="flex rounded-b-sm shadow-card p-3">
              <img src={avatar} />
              <p>Олена Іваненко <br /> Засновниця та виконавча директорка</p>
            </li>
            <li className="flex rounded-sm shadow-card p-3">
              <img src={avatar} />
              <p>Марія Ковальчук <br /> Координаторка програм</p>
            </li>
            <li className="flex rounded-sm shadow-card p-3">
              <img src={avatar} />
              <p>Ірина Петренко <br /> Спеціалістка з комунікацій</p>
            </li>
            <li className="flex rounded-sm shadow-card p-3">
              <img src={avatar} />
              <p>Анна Шевченко <br /> Юридична консультантка</p>
            </li>
            <li className="flex rounded-sm shadow-card p-3">
              <img src={avatar} />
              <p>Оксана Литвин <br /> Координаторка волонтерів</p>
            </li>
            <li className="flex rounded-sm shadow-card p-3">
              <img src={avatar} />
              <p>Світлана Бондаренко <br /> Фінансовий менеджер</p>
            </li>
            <li className="flex rounded-sm shadow-card p-3">
              <img src={avatar} />
              <p>Тетяна Грищук <br /> Культурний куратор</p>
            </li>
            <li className="flex rounded-sm shadow-card p-3">
              <img src={avatar} />
              <p>Вікторія Грищук <br /> Психолог</p>
            </li>
          </ul>
        </div>

        <div className="max-w-full">
          <h2 className="flex flex-col justify-center items-center font-montserratBold text-2xl py-3 xl:py-4">
            Наші партнери
          </h2>
          <ul className="max-w-120 md:max-w-full grid  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 list-none text-base lg:text-lg leading-5 md:leading-5 lg:leading-5.5 xl:leading-7 xl:py-5">
            <li className="flex rounded-b-sm bg-amber-50 shadow-card p-3">
              <img src={partner} alt="p"/>
              <p>Генеральне консульство України в Німеччині</p>
            </li>
            <li className="flex rounded-sm bg-blue-50 shadow-card p-3">
              <img src={partner} alt="p"/>
              <p>
                Міністерство закордонних справ України (проект «Український
                інститут»)
              </p>
            </li>
            <li className="flex rounded-sm bg-emerald-50 shadow-card p-3">
              <img src={partner} alt="p"/>
              <p>Integrationamt Bad Oeynhausen</p>
            </li>
            <li className="flex rounded-sm bg-fuchsia-50 shadow-card p-3">
              <img src={partner}  alt="p"/>
              <p>Plast – Ukrainischer Pfadfinderbund в Німеччин</p>
            </li>
            <li className="flex rounded-sm bg-indigo-50 shadow-card p-3">
              <img src={partner} alt="p"/>
              <p>Українська суботня школа в Гамбурзі</p>
            </li>
            <li className="flex rounded-sm bg-pink-50 shadow-card p-3">
              <img src={partner} alt="p"/>
              <p>Міжнародний фонд «Відродження»</p>
            </li>
          </ul>
        </div>
      </section>

      <p>Статут PDF</p>
      
    </div>
  );
};
