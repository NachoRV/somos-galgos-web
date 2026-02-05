import { getPayload } from 'payload';
import config from '@payload-config';
import { useTranslations } from 'next-intl';
import { getTranslations as getServerTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import { LexicalContent } from '@/components/LexicalContent';
import { SobreNosotrosHeroSection } from '@/components/about';
import { ImpactCounterSection } from '@/components/home/ImpactCounterSection';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const payload = await getPayload({ config });

  try {
    const aboutPage = await (payload.findGlobal as any)({
      slug: 'about-page',
    });

    const title = aboutPage?.meta_title || 'Sobre Nosotros - Somos Galgos';
    const description = aboutPage?.meta_description || 'Conoce más sobre Somos Galgos, nuestra misión y visión.';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/${locale}/sobre-nosotros`,
        type: 'website',
      },
    };
  } catch (error) {
    console.error('Error fetching AboutPage for metadata:', error);
    return {
      title: 'Sobre Nosotros - Somos Galgos',
      description: 'Conoce más sobre Somos Galgos, nuestra misión y visión.',
    };
  }
}

export default async function SobreNosotrosPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getServerTranslations('menu');
  const payload = await getPayload({ config });

  let aboutData: any = null;

  try {
    aboutData = await (payload.findGlobal as any)({
      slug: 'about-page',
    });
  } catch (error) {
    console.error('Error fetching AboutPage:', error);
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {aboutData?.title && (
        <SobreNosotrosHeroSection
          title={aboutData.title}
          subtitle={aboutData.subtitle}
          description={aboutData.description}
        />
      )}

      {/* Mission & Vision Section */}
      {(aboutData?.mission || aboutData?.vision) && (
        <section className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            {aboutData.mission && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Misión</h2>
                <div className="text-gray-700">
                  <LexicalContent content={aboutData.mission} />
                </div>
              </div>
            )}
            {aboutData.vision && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Visión</h2>
                <div className="text-gray-700">
                  <LexicalContent content={aboutData.vision} />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Core Values Section */}
      {aboutData?.values && aboutData.values.length > 0 && (
        <section className="py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Nuestros Valores
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aboutData.values.map((value: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {value.value}
                  </h3>
                  {value.description && (
                    <p className="text-gray-600">{value.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Statistics Section */}
      <ImpactCounterSection />
      {/* {aboutData?.stats && aboutData.stats.length > 0 && (
        <section className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Nuestro Impacto
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aboutData.stats.map((stat: any, idx: number) => (
                <div
                  key={idx}
                  className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg"
                >
                  <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
                    {stat.number}
                    {stat.suffix}
                  </div>
                  <p className="text-gray-700 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* Team Section */}
      {aboutData?.team_members && aboutData.team_members.length > 0 && (
        <section className="py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Nuestro Equipo
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {aboutData.team_members.map((member: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {member.image && (
                    <div className="relative h-64 bg-gray-200">
                      {typeof member.image === 'object' && member.image.url ? (
                        <img
                          src={member.image.url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100" />
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                    {member.bio && (
                      <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        {member.email}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}