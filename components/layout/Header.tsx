'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export function Header() {
	const t = useTranslations('Header');
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	// Check if we're on the home page
	const isHomePage = pathname === '/' || pathname === '/es' || pathname === '/en';

	useEffect(() => {
		// Only apply scroll effect on home page
		if (!isHomePage) {
			setIsVisible(true); // Always visible on non-home pages
			return;
		}

		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// Mostrar header solo si hemos scrolleado más de 50px (only on home)
			setIsVisible(currentScrollY > 50);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [isHomePage]);

	// Helper to check if link is active
	const isActive = (href: string) => {
		// Remove locale from pathname (e.g., /es/colabora -> /colabora)
		const pathWithoutLocale = pathname.replace(/^\/(es|en)/, '') || '/';
		// Check if current path starts with the href (for exact or nested matches)
		return pathWithoutLocale === href || pathWithoutLocale.startsWith(href + '/');
	};

	const navigation = [
		{ name: t('about'), href: '/sobre-nosotros' },
		{ name: t('dogs'), href: '/galgos' },
		{ name: t('adopt'), href: '/adoptar' },
		{ name: t('sponsor'), href: '/apadrinar' },
		// { name: t('blog'), href: '/blog' },
		{ name: t('contact'), href: '/contacto' },
	];

	const colaborateOptions = [

		{ name: t('adopt'), href: '/adoptar' },
		{ name: t('foster'), href: '/acoger' },
		{ name: t('sponsor'), href: '/apadrinar' },
		{ name: t('socio'), href: '/socio' },
		{ name: t('volunteer'), href: '/voluntario' },
	];

	return (
		<header
			className={`fixed top-0 z-50 w-full backdrop-blur shadow-lg/40 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
				}`}
		>
			<nav className="flex h-16 items-center justify-between px-16 bg-[var(--color-secondary)]/0 w-full">
				<div className='flex items-center gap-6'>
					<Link href='/' className='flex items-center space-x-2'>
						<Image
							src="/logo.webp"
							alt="Logo Somos Galgos"
							width={40}
							height={40}
							className=""
							priority
						/>
						<span className='text-2xl font-bold text-[var(--color-secondary)]'>Somos Galgos</span>
					</Link>
				</div>

				{/* Desktop Navigation */}
				<div className='hidden lg:flex lg:gap-x-6'>
					<div className="dropdown dropdown-hover">
						<Link
							href="/colabora"
							className={`font-semibold text-lg cursor-pointer hover:text-primary hover:underline underline-offset-8 decoration-[var(--color-secondary)] decoration-4 ${
								isActive('/colabora') ? 'text-primary underline' : ''
							}`}
						>
							{t('colaborate')}
						</Link>
						<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
							{colaborateOptions.map(opt => (
								<li key={opt.href}><Link href={opt.href}>{opt.name}</Link></li>
							))}
						</ul>
					</div>
					{navigation.filter(item => !['/apadrinar', '/socio', '/voluntario', '/adoptar'].includes(item.href)).map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className={`font-semibold text-lg transition-colors hover:text-primary hover:underline underline-offset-8 decoration-[var(--color-secondary)] decoration-4 ${
								isActive(item.href) ? 'text-primary underline' : ''
							}`}
						>
							{item.name}
						</Link>
					))}
				</div>

				<div className='hidden lg:flex lg:gap-x-4'>
					<a href='https://www.teaming.net/somosgalgos' target='_blank' rel='noopener noreferrer' className='btn btn-primary'>
						{t('teamingButton')}
					</a>
				</div>
				<div className='flex lg:hidden'>
					<button
						className='btn btn-ghost btn-square'
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X className='h-6 w-6' />
						) : (
							<Menu className='h-6 w-6' />
						)}
					</button>
				</div>
			</nav>

			{/* Mobile Navigation */}
			{mobileMenuOpen && (
				<div className='lg:hidden'>
					<div className='space-y-1 px-4 pb-3 pt-2'>
						{navigation.filter(item => !['/apadrinar', '/socio', '/voluntario', '/adoptar'].includes(item.href)).map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={`block rounded-md px-3 py-2 text-base font-medium hover:bg-base-200 ${
									isActive(item.href) ? 'bg-base-200 text-primary font-semibold' : ''
								}`}
								onClick={() => setMobileMenuOpen(false)}
							>
								{item.name}
							</Link>
						))}
						<div className="collapse collapse-arrow bg-base-100">
							<input type="checkbox" />
							<div className="collapse-title font-semibold text-base bg-base-100">
								{t('colaborate')}
							</div>
							<div className="collapse-content p-0">
								<ul className="menu p-0">
									{colaborateOptions.map(opt => (
										<li key={opt.href}>
											<Link href={opt.href} className='block px-3 py-2 hover:bg-base-200' onClick={() => setMobileMenuOpen(false)}>{opt.name}</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className='pt-4'>
							<a
								href='https://www.teaming.net/somosgalgos'
								target='_blank'
								rel='noopener noreferrer'
								className='btn btn-primary w-full'
							>
								{t('teamingButton')}
							</a>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}