"use client";

import { ORG_INFO, SOCIAL_LINKS } from '@/lib/constants';
import { FacebookIcon } from '@/components/icons/FacebookIcon';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { TwitterIcon } from '@/components/icons/TwitterIcon';
import { TiktokIcon } from '@/components/icons/TiktokIcon';
import { useTranslations } from 'next-intl';

export default function ContactInfo() {
  const t = useTranslations('Contact');
  return (
    <aside className="bg-gray-50 p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-2">{t('infoTitle', { default: 'Información de contacto' })}</h3>
      <p className="mb-1"><strong>{t('email')}:</strong> <a href={`mailto:${ORG_INFO.email}`} className="link">{ORG_INFO.email}</a></p>
      <p className="mb-1"><strong>{t('location', { default: 'Ubicación' })}:</strong> {ORG_INFO.location}</p>
      <p className="mb-1"><strong>{t('bizum', { default: 'Bizum ONG' })}:</strong> {ORG_INFO.bizumCode}</p>
      <div className="mt-4">
        <h4 className="font-semibold mb-1">{t('followUs', { default: 'Síguenos:' })}</h4>
        <div className="flex gap-3">
          <a 
            className="btn btn-circle btn-ghost hover:bg-secondary"
            href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookIcon className="icon-social w-6 h-6" /></a>
          <a className="btn btn-circle btn-ghost hover:bg-secondary"  href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon className="icon-social w-6 h-6" /></a>
          <a className="btn btn-circle btn-ghost hover:bg-secondary" href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"><TwitterIcon className="icon-social w-6 h-6" /></a>
          <a className="btn btn-circle btn-ghost hover:bg-secondary" href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><TiktokIcon className="icon-social w-6 h-6" /></a>
        </div>
      </div>
    </aside>
  );
}