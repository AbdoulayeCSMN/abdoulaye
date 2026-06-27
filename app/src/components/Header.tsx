'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@components/ui/navigation-menu'
import { Button } from '@components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@components/ui/sheet'
import { Menu, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@lib/utils'
import LanguageSwitcher from '@components/LanguageSwitcher'
import { useTranslations, useLocale } from '@lib/i18n'

export default function PortfolioHeader() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const t = useTranslations('nav')
  const locale = useLocale()

  // Build locale-aware href
  const href = (path: string) => `/${locale}${path}`

  const navItems = [
    { label: t('home'),     to: href('/') },
    { label: t('projects'), to: href('/projects') },
    {
      label: t('services'),
      to: href('/services'),
      items: [
        { label: 'Développement Web',  to: href('/services'), description: 'Sites et applications web modernes' },
        { label: 'Design UI/UX',       to: href('/services'), description: 'Interfaces intuitives et esthétiques' },
        { label: 'Consulting',         to: href('/services'), description: 'Conseils et stratégie digitale' },
      ],
    },
    { label: t('notes'), to: href('/notes') },
    { label: t('about'), to: href('/about') },
    { label: t('blog'),  to: href('/blog') },
  ]

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn(
      'w-full z-50 transition-all duration-300 fixed top-0 left-0 right-0',
      isScrolled
        ? 'bg-background/95 backdrop-blur-md border-b shadow-sm'
        : 'bg-background/80 backdrop-blur-sm',
    )}>
      <div className="container mx-auto px-4 h-16 lg:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href={href('/')} className="font-bold text-xl tracking-tight hover:text-primary transition-colors">
          ABDOULAYE
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.to}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-2 p-4">
                          {item.items.map((sub) => (
                            <li key={sub.label}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={sub.to}
                                  className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                  <div className="text-sm font-medium">{sub.label}</div>
                                  <p className="text-xs text-muted-foreground">{sub.description}</p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.to}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          pathname === item.to && 'text-primary font-semibold',
                        )}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button asChild className="hidden lg:inline-flex">
            <Link href={href('/contact')}>{t('contact')}</Link>
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle>ABDOULAYE</SheetTitle>
              <SheetDescription className="sr-only">Navigation menu</SheetDescription>
              <nav className="flex flex-col gap-2 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    href={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'px-4 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors',
                      pathname === item.to && 'bg-accent text-primary',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-2 border-t mt-2">
                  <Button asChild className="w-full">
                    <Link href={href('/contact')} onClick={() => setMobileMenuOpen(false)}>
                      {t('contact')}
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
