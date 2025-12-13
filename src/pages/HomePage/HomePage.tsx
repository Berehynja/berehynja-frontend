import { useTranslation } from "react-i18next";
// import { Baner, BanerText, BannerTitele, Hero, HomeContainer } from "./HomePage.styled";
import { HowWeHelp } from "../../components/Sections/HowWeHelp";
import ban from "../../images/children.jpg";

export function HomePage() {
  const { t } = useTranslation();
  
  return (
    <>
      <section>
        <div className=" flex flex-col justify-between items-start p-5
          min-w-85 max-w-120 min-h-75 bg-no-repeat bg-cover bg-center 
          sm:max-w-3xl  sm:min-h-125 sm:p-10
          md:px-4 md:max-w-5xl  md:min-h-150
          lg:px-8 lg:max-w-7xl  lg:min-h-175
          xl:px-10 xl:max-w-360  " 
          style={{backgroundImage: `url(${ban})`,}}>

          <h1 className=" font-montserratBold  text-3xl text-white align-sub mb-4 sm:text-4xl md:text-5xl">{t("hero.welcome")}</h1>
          
          <p className=" block w-full font-montserratRegular text-xl text-white leading-8 bg-black/50  rounded-lg 
            indent-8 p-5 sm:text-2xl md:text-3xl md:leading-10">
            {t("hero.description")}
            {/* Наша мета — створити тепле та дружнє середовище, де кожен
            почуватиметься як вдома, знайде нових друзів та отримає необхідну
            підтримку. */}
          </p>
        </div>
      </section>
      <section className=" w-full px-3.5 md:px-4 lg:px-8 xl:px-10 my-10">
        <p>HOME</p>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint vero
          aspernatur cupiditate voluptatibus! Odio suscipit tempora pariatur
          natus, culpa ipsum vero cupiditate assumenda quaerat placeat, enim
          dolorum adipisci, minus vel.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint vero
          aspernatur cupiditate voluptatibus! Odio suscipit tempora pariatur
          natus, culpa ipsum vero cupiditate assumenda quaerat placeat, enim
          dolorum adipisci, minus vel.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint vero
          aspernatur cupiditate voluptatibus! Odio suscipit tempora pariatur
          natus, culpa ipsum vero cupiditate assumenda quaerat placeat, enim
          dolorum adipisci, minus vel.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint vero
          aspernatur cupiditate voluptatibus! Odio suscipit tempora pariatur
          natus, culpa ipsum vero cupiditate assumenda quaerat placeat, enim
          dolorum adipisci, minus vel.
        </p>
      </section>
    </>
  );
}
