import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { ContactForm } from "../../components/Contacts/ContactForm";
import { ContactInfo } from "../../components/Contacts/ContactInfo";
import { ContactMap } from "../../components/Contacts/ContactMap";
import { WorkingHours } from "../../components/Contacts/WorkingHours";
import { PageLoader } from "../../components/ui/PageLoader";
import type { ContactData } from "../../types/contactData";


export const Contact = () => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<ContactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleContactsChange = useCallback((data: ContactData) => {
    setContacts(data);
    setIsLoading(false);
  }, []);

  return (
    <>
      <PageLoader visible={isLoading} />

      <div className="font-nunito w-full">
        <header className="flex flex-col items-center justify-center gap-6 py-8 md:flex-row md:gap-10 md:py-12">
          <div className="flex max-w-full shrink-0 flex-col items-center justify-center">
            <h1 className="pb-1 text-center text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              {t("contact.page.title")}
            </h1>

            <div
              aria-hidden="true"
              className="h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-yellow-400"
            />
          </div>

          <p className="max-w-4xl px-2 text-center text-base leading-6 font-medium text-slate-600 md:px-0 md:text-left md:text-lg ">
            {t("contact.page.description")}
          </p>
        </header>

        <section
          aria-label={t("contact.page.title")}
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
