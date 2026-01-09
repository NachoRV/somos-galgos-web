'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';

export function BlogSection() {
  const t = useTranslations('Home.Blog');
  
  const posts = [
    {
      id: '1',
      title: t('post1Title'),
      excerpt: t('post1Excerpt'),
      date: '2024-12-15',
      slug: 'cuidados-basicos-galgos',
    },
    {
      id: '2',
      title: t('post2Title'),
      excerpt: t('post2Excerpt'),
      date: '2024-12-10',
      slug: 'proceso-adopcion',
    },
    {
      id: '3',
      title: t('post3Title'),
      excerpt: t('post3Excerpt'),
      date: '2024-12-05',
      slug: 'alimentacion-galgos',
    },
  ];
  
  return (
    <section className="py-20 px-16 bg-base-200">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[var(--color-primary)]">
            {t('title')}
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <article key={post.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
              <figure className="h-48 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)]">
                <Image
                  src="/logo.webp"
                  alt={post.title}
                  width={400}
                  height={200}
                  className="object-contain w-24 h-24"
                />
              </figure>
              <div className="card-body">
                <div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <h3 className="card-title text-xl mb-3">
                  {post.title}
                </h3>
                <p className="text-base-content/70 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="btn btn-ghost btn-sm gap-2"
                  >
                    {t('readMore')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center">
          <Link 
            href="/blog" 
            className="btn btn-secondary btn-lg px-8"
          >
            {t('viewAllPosts')}
          </Link>
        </div>
      </div>
    </section>
  );
}
