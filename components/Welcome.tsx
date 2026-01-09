'use client';

import Image from 'next/image';
import somosGalgosLogo from '@/public/logo.webp';
import background from '@/public/background.svg';
import { Mail, Users, Euro, Heart, Home, UserPlus } from 'lucide-react';
import { FacebookIcon } from '@/components/icons/FacebookIcon';
import { BrandAmazonIcon } from '@/components/icons/BrandAmazonIcon';
import { AmazonIcon } from '@/components/icons/AmazonIcon';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { TwitterIcon } from '@/components/icons/TwitterIcon';
import { TiktokIcon } from '@/components/icons/TiktokIcon';
import { SITE_URL, SOCIAL_LINKS } from '@/lib/constants';

const data = [
  {
    text: 'Suscríbete a nuestra newsletter y recibe todas las novedades en tu e-mail',
    link: 'https://goo.su/oWYLpBA',
    icon: Mail,
  },
  {
    text: 'Hazte socio  (desde 5€/mes)',
    link: 'https://goo.su/Kwxpq9',
    icon: Users,
  },
  {
    text: 'Apadrina (desde 10€/mes)',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSe18kYalVFEj9l6zpA0XhfIRZgYSpngFRxDugXn5MGqrJQSWA/viewform',
    icon: Heart,
  },
  {
    text: 'Dona 1€/mes en Teaming',
    link: 'https://www.teaming.net/somosgalgos',
    icon: Euro,
  },
  {
    text: 'Lista de deseos en Amazon',
    link: 'https://www.amazon.es/hz/wishlist/ls/8VOG5MGRKLJ1?ref_=wl_fv_le',
     icon: BrandAmazonIcon,
  },
  {
    text: 'Quiero ADOPTAR',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSdpmNm8YZl3XxygXcDekC94RIRc9mLGo2AwHbIC3S281R44iQ/viewform',
    icon: UserPlus,
  },
  {
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSf8vb5jqcAh2CwL5sVGHWPegqwEDKClQ0gFLb6RM9VwIRbA7g/viewform',
    text: 'Quiero ser CASA DE ACOGIDA',
    icon: Home,
  },
  {
    text: 'Hazte voluntario',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSfCJ1Nujz0XNEZN_rVr2OA_bgBMpDkB2--KyWKFMsh7rJEsfg/viewform',
    icon: Users,
  },
];

export default function Welcome() {
  return (
    <div id="container">
      <Image
        id="background"
        src={background}
        alt=""
        priority
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{ filter: 'blur(100px)' }}
      />
      <main>
        <section id="hero">
          <a href={SITE_URL}>
            <Image
              src={somosGalgosLogo}
              width={230}
              height={96}
              alt="Somos Galgos"
              priority
            />
          </a>
          <section id="social">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en Facebook"
            >
              <FacebookIcon className="icon-social" />
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en Instagram"
            >
              <InstagramIcon className="icon-social" />
            </a>
            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en Twitter"
            >
              <TwitterIcon className="icon-social" />
            </a>
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en TikTok"
            >
              <TiktokIcon className="icon-social" />
            </a>
            <a
              href={SOCIAL_LINKS.amazonWishlist}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nuestra lista de deseos en Amazon"
            >
              <AmazonIcon className="icon-social" />
            </a>
          </section>
          <h1>
            Asociación <strong>Somos Galgos</strong>,
          </h1>
          <h2>
            Organización sin ánimo de lucro. Galgos de casa, no de caza. Bizum ONG:
            01979
          </h2>
        </section>
        <section id="links">
          {data.map(({ link, text, icon: Icon }) => (
            <a
              key={text}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="button"
            >
              <Icon />
              {text}
            </a>
          ))}
        </section>
      </main>

      <style jsx>{`
        #background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          filter: blur(100px);
        }

        #container {
          font-family: Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans",
            Arial, sans-serif;
          height: 100%;
          padding-bottom: 30px;
          height: auto;
        }

        #hero {
          display: flex;
          align-items: start;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 16px;
          padding-top: 30px;
        }

        #social {
          width: 40%;
          height: 40px;
          display: flex;
          gap: 1.5em;
          margin-top: 3em;
          justify-content: center;
        }

        #social a {
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: color 0.2s;
          transition: stroke 0.2s;
        }
        .icon-social {
          width: 2.5em;
          height: 2.5em;
        }

        #social a:hover .icon-social {
          transform: scale(1.2) rotate(-6deg) translateY(-6px);
          filter: drop-shadow(0 8px 16px rgba(190,154,20,0.5));
          stroke: #be9a14 !important;
          fill: #be9a14 !important;
          color: #be9a14 !important;
        }
        #social a {
          cursor: pointer;
        }
        .icon-social {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        main {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        h1 {
          font-size: 22px;
          margin-top: 1.5em;
        }

        #links {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 90%;
          columns: 2;
        }

        #links a {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          text-decoration: none;
          transition: color 0.2s;
          width: 100%;
          font-size: 1.2em;
        }

        #links a:hover {
          color: rgb(78, 80, 86);
        }

        #links a svg {
          height: 1em;
          margin-right: 8px;
        }
        #social a svg {
          height: 100% !important;
          width: 100% !important;
        }

        #links a.button {
          background: linear-gradient(83.21deg, #be9a14 0%, #be9a14 100%);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.12),
            inset 0 -2px 0 rgba(0, 0, 0, 0.24);
          border-radius: 10px;
        }

        #links a.button:hover {
          color: rgb(230, 230, 230);
          box-shadow: none;
        }

        h2 {
          margin: 0 0 1em;
          font-weight: normal;
          color: #111827;
          font-size: 20px;
          text-align: center;
        }

        @media screen and (min-width: 768px) {
          #links a {
            max-width: 750px;
          }

          h1 {
            line-height: 1.5;
          }
        }
      `}</style>
    </div>
  );
}
