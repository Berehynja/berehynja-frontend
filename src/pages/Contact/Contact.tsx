import { SocialMedia } from "../../components/SocialMedia/SocialMedia";

export const Contact = () => {
  return (
    <div className="w-full py-8">
      <div
        className="flex flex-col justify-center items-center gap-8 py-7 md:py-10 font-montserratBold 
      md:flex-row "
      >
        <div className="max-w-4xl ">
          <h1 className="flex text-4xl md:text-5xl  font-montserratBold py-4 justify-center ">
            Зв'яжіться з нами{" "}
          </h1>{" "}
          <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-yellow-400 mx-auto mb-4"></div>
        </div>

        <p className="flex justify-center items-center max-w-3xl text-lg px-4 md:text-xl md:px-0 leading-8">
          Ми тут, щоб допомогти вам. Якщо у вас є запитання, потрібна підтримка
          чи ви хочете поділитися відгуком, наша команда готова вам допомогти.
        </p>
      </div>

      <section className="flex w-full flex-col md:flex-row justify-center items-center md:gap-6 lg:gap-8 py-12 ">
        <form
          className=" flex flex-col grow min-w-80 w-full max-w-120 p-5 gap-8 md:w-1/2  px-6  rounded-lg shadow-lg"
          name="email_form"
        >
          <h2 className="font-montserratBold text-2xl py-3 xl:py-4">
            Напишіть нам
          </h2>
          <label className=" flex flex-col">
            Full Name *
            <input
              className="w-full h-10 p-2 border rounded-md"
              type="name"
              name="name"
              placeholder="Your full Name"
            />
          </label>

          <label className=" flex flex-col">
            Email Address *
            <input
              className="w-full h-10 p-2 border rounded-md"
              type="email"
              name="email"
              placeholder="your@email.com"
            />
          </label>
          <label className=" flex flex-col">
            Phone Number (Optional)
            <input
              className="w-full h-10 p-2 border rounded-md"
              type="number"
              name="number"
              placeholder="Your number"
            />
          </label>

          <label className=" flex flex-col">
            Message *
            <textarea
              className="p-2 h-30 border rounded-md"
              name="message"
              rows={5}
              placeholder="Enter your message here..."
            ></textarea>
          </label>

          <button className="w-full h-10 rounded-lg bg-Green" type="submit">
            Send message
          </button>
        </form>

        <div className="flex flex-col min-w-80 w-full max-w-120 p-5 md:w-1/2  gap-8 ">
          <div className="p-5 rounded-lg shadow-lg">
            <h2 className="font-montserratBold text-2xl py-3 xl:py-4">
              Контактна інформація
            </h2>
            <ul>
              <li>
                <h3 className="font-montserratMedium text-xl py-3 ">
                  Електронна адреса
                </h3>
                <a
                  href="mailto:bereginia.badoeynhausen@gmail.com"
                  target="_blank"
                >
                  bereginia.badoeynhausen@gmail.com
                </a>
              </li>
              <li>
                <h3 className="font-montserratMedium text-xl py-3 ">Телефон</h3>
                <a href="tel:+4915128161383">+49 151 28161383</a>
              </li>
              <li>
                <h3 className="font-montserratMedium text-xl py-3 ">Адреса</h3>
                <a
                  href="https://www.google.com/maps/place/Johanniter-Mehrgenerationenhaus+Bad+Oeynhausen/@52.1979902,8.8037727,314m/data=!3m1!1e3!4m6!3m5!1s0x47ba72a07b459829:0x19fbe41cee571634!8m2!3d52.1978688!4d8.8039899!16s%2Fg%2F11c6q9n5kc?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  aria-label="Google Maps location"
                >
                  32545 Weserstraße 24 Bad-Oeynhausen, Germany
                </a>
              </li>
              <li>
                <span className=" bg-gray-500"><SocialMedia /></span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col p-5 gap-4 rounded-lg bg-blue-50">
            <h3 className="font-montserratBold text-xl py-3 xl:py-4">
              Робочі години
            </h3>
            <div className="flex justify-between">
              <span>Понеділок - П'ятниця</span>
              <span>9:00 - 18:00</span>
            </div>
            <div className="flex justify-between">
              <span>Субота</span>
              <span>Зачинено</span>
            </div>
            <div className="flex justify-between">
              <span>Неділя</span>
              <span>10:00 - 17:00</span>
            </div>
          </div>

          <div></div>
        </div>
      </section>
    </div>
  );
};
