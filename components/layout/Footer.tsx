'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FacebookIcon } from '@/components/icons/FacebookIcon';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { TiktokIcon } from '@/components/icons/TiktokIcon';
import { TwitterIcon } from '@/components/icons/TwitterIcon';

export function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: t('dogs'), href: '/galgos' },
    { name: t('adopt'), href: '/adoptar' },
    { name: t('foster'), href: '/acoger' },
    { name: t('sponsor'), href: '/apadrinar' },
    { name: t('contact'), href: '/contacto' },
  ];

  const collaborateLinks = [
    { name: t('socio'), href: '/socio' },
    { name: t('volunteer'), href: '/voluntario' },
  ];

  const legalLinks = [
    { name: t('privacy'), href: '/privacidad' },
    { name: t('terms'), href: '/terminos' },
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/somosgalgos', icon: FacebookIcon },
    { name: 'Instagram', href: 'https://instagram.com/somosgalgos', icon: InstagramIcon },
    { name: 'Twitter', href: 'https://twitter.com/somos_galgos', icon: TwitterIcon },
    { name: 'TikTok', href: 'https://tiktok.com/@somosgalgos', icon: TiktokIcon },
  ];

  return (
    <footer className="bg-base-200/80 backdrop-blur-sm text-base-content border-t border-base-300">
      <div className="w-full px-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-between">
          {/* Sobre Nosotros */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/logo.webp"
                alt="Logo Somos Galgos"
                width={40}
                height={40}
              />
              <span className="text-xl font-bold text-secondary">Somos Galgos</span>
            </div>
            <p className="text-sm opacity-80">{t('aboutText')}</p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colabora */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('collaborate')}</h3>
            <ul className="space-y-2">
              {collaborateLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold mb-2 text-sm">{t('legal')}</h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('followUs')}</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-circle btn-ghost hover:bg-secondary/20"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="divider mt-8 mb-6"></div>
        <div className="text-center space-y-2">
          <p className="text-sm opacity-80">
            {t('copyright', { year: currentYear })}
          </p>
          <p className="text-xs opacity-60">
            {t('madeWith').split('irvb.dev').map((part, index, array) => (
              index === array.length - 1 ? (
                <span key={index}>{part}</span>
              ) : (
                <span key={index}>
                  {part}
                  <a
                    href="https://irvb.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-secondary transition-colors underline"
                  >
                    irvb.dev
                  </a>
                </span>
              )
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}