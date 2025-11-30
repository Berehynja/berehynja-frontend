import { useTranslation } from "react-i18next";
import { Baner, BanerText, BannerTitele, Hero, HomeContainer } from "./HomePage.styled";

export function HomePage() {
  const { t } = useTranslation();
  return (
    <>
      <Hero>
        <Baner>
          <BannerTitele>{t("hero.welcome")}</BannerTitele>
          <BanerText>
            {t("hero.description")}
            {/* Наша мета — створити тепле та дружнє середовище, де кожен
            почуватиметься як вдома, знайде нових друзів та отримає необхідну
            підтримку. */}
          </BanerText>
        </Baner>
      </Hero>
      <HomeContainer>
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
      </HomeContainer>
    </>
  );
}
