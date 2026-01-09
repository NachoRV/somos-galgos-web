import { useTranslations } from "next-intl";

export default function SocioPage() {
  const t = useTranslations("menu");
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-4">{t("socio")}</h1>
      <p className="text-lg">Trabajando en la página: {t("socio")}</p>
    </main>
  );
}