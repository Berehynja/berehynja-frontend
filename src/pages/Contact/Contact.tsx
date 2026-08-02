import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { ContactForm } from "../../components/Contacts/ContactForm";
import { ContactInfo } from "../../components/Contacts/ContactInfo";
import { ContactMap } from "../../components/Contacts/ContactMap";
import { WorkingHours } from "../../components/Contacts/WorkingHours";
import { PageLoader } from "../../components/ui/PageLoader";
import type { ContactData } from "../../types/contactData";
import type { LangKey } from "../../types/types";

const CONTACT_PAGE_TEXT = {
  title: {
    ua: "Зв’яжіться з нами",
    de: "Kontaktieren Sie uns",
    en: "Contact us",
  },
  description: {
    ua: "Ми тут, щоб допомогти вам. Якщо у вас є запитання, потрібна підтримка чи ви хочете поділитися відгуком, наша команда готова вам допомогти.",
    de: "Wir sind für Sie da. Wenn Sie Fragen haben, Unterstützung benötigen oder uns Feedback geben möchten, hilft Ihnen unser Team gerne weiter.",
    en: "We are here to help. If you have questions, need support or would like to share feedback, our team is ready to assist you.",
  },
};

export const Contact = () => {
  const { i18n } = useTranslation();
  const [contacts, setContacts] = useState<ContactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language)
    .split("-")[0]
    .toLowerCase();
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  const handleContactsChange = useCallback((data: ContactData) => {
    setContacts(data);
    setIsLoading(false);
  }, []);

  return (
    <>
      <PageLoader visible={isLoading} />

      <div className="font-nunito mx-auto w-full max-w-7xl px-3 pb-12 md:px-8">
        <header className="flex flex-col items-center justify-center gap-6 py-8 md:flex-row md:gap-10 md:py-12">
          <div className="flex max-w-full shrink-0 flex-col items-center justify-center">
            <h1 className="pb-4 text-center text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              {CONTACT_PAGE_TEXT.title[currentLang]}
            </h1>

            <div
              aria-hidden="true"
              className="h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-yellow-400"
            />
          </div>

          <p className="max-w-4xl px-2 text-center text-base leading-7 font-medium text-slate-600 md:px-0 md:text-left md:text-lg md:leading-8">
            {CONTACT_PAGE_TEXT.description[currentLang]}
          </p>
        </header>

        <section
          aria-label={CONTACT_PAGE_TEXT.title[currentLang]}
          className="mt-4 grid grid-cols-1 gap-8 lg:mt-8 lg:grid-cols-2 lg:gap-10"
        >
          <div className="min-w-0 [&>section]:h-full">
            <ContactForm />
          </div>

          <div className="min-w-0 [&>section]:h-full">
            <ContactInfo onContactsChange={handleContactsChange} />
          </div>

          <div className="min-w-0 [&>section]:h-full">
            <WorkingHours />
          </div>

          <ContactMap contacts={contacts} />
        </section>
      </div>
    </>
  );
};
