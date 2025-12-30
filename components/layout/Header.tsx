'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navigation = [
	{ name: 'Inicio', href: '/' },
	{ name: 'Galgos', href: '/galgos' },
	{ name: 'Adoptar', href: '/adoptar' },
	{ name: 'Acoger', href: '/acoger' },
	{ name: 'Apadrinar', href: '/apadrinar' },
	{ name: 'Historias', href: '/historias' },
	{ name: 'Blog', href: '/blog' },
	{ name: 'Sobre Nosotros', href: '/sobre-nosotros' },
	{ name: 'Contacto', href: '/contacto' },
];

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className='sticky top-0 z-50 w-full border-b bg-base-100 backdrop-blur'>
			<nav className='container flex h-16 items-center justify-between px-4'>
				<div className='flex items-center gap-6'>
					<Link href='/' className='flex items-center space-x-2'>
						<span className='text-2xl font-bold'>🐕 Somos Galgos</span>
					</Link>
				</div>

				{/* Desktop Navigation */}
				<div className='hidden lg:flex lg:gap-x-6'>
					{navigation.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className='text-sm font-medium transition-colors hover:text-primary'
						>
							{item.name}
						</Link>
					))}
				</div>

				<div className='hidden lg:flex lg:gap-x-4'>
					<Link href='/adoptar' className='btn btn-primary'>
						Adopta Ahora
					</Link>
				</div>

				{/* Mobile menu button */}
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
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className='block rounded-md px-3 py-2 text-base font-medium hover:bg-base-200'
								onClick={() => setMobileMenuOpen(false)}
							>
								{item.name}
							</Link>
						))}
						<div className='pt-4'>
							<Link
								href='/adoptar'
								className='btn btn-primary w-full'
							>
								Adopta Ahora
							</Link>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}