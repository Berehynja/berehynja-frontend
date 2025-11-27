import { useTranslation } from "react-i18next";
import { Link, Nav } from "./HeaderNav.styled";

export const HeaderNav = () => {
  const { t } = useTranslation();
  console.log("🚀 ~ t:", t)
  return (
    <Nav  >
      <Link to="/" end>
        {t("header.home")}
      </Link>
      <Link to="about">{t("header.about")}</Link>
      <Link to="programs">{t("header.programs")}</Link>
      <Link to="events">{t("header.events")}</Link>
      {/* <Link to="news">НОВИНИ</Link> */}
    </Nav>
  );
};
