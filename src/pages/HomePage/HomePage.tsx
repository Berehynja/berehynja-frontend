import { Baner, BanerText, BannerTitele, Hero, HomeContainer } from "./HomePage.styled";

export function HomePage() {
  return (
    <>
      <Hero>
        <Baner>
          <BannerTitele>Ласкаво просимо до «Berehynja»!</BannerTitele>
          <BanerText>
                «Berehynja» — це український простір у Німеччині, створений для
            дітей, підлітків та дорослих, які вимушено опинилися далеко від
            дому. Ми об’єднуємо українські родини, допомагаємо зберігати мову,
            культуру та традиції, а також підтримуємо тих, хто проходить шлях
            адаптації та інтеграції в нове середовище. <br /> 
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
