import about from "../../images/bereg-about22.jpg";
console.log("🚀 ~ about:", about);

export const About = () => {
  return (
    <div className="flex flex-col justify-center   py-8">
      <div
        className="flex flex-col justify-center items-center gap-8 py-7 md:py-10 font-montserratBold 
      md:flex-row "
      >
        <div className="max-w-4xl ">
          <h1 className="flex text-4xl md:text-5xl  font-bold py-4 justify-center ">
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
          <h2 className="font-montserratBold text-2xl py-3 xl:py-4">Історія команди</h2>
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
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint vero
        aspernatur cupiditate voluptatibus! Odio suscipit tempora pariatur
        natus, culpa ipsum vero cupiditate assumenda quaerat placeat, enim
        dolorum adipisci, minus vel.
      </p>

      <p>Статут PDF</p>
      <p>Партнерство</p>
    </div>
  );
};
