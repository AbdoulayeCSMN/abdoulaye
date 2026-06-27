'use client';

/**
 * Lightweight i18n — zero external dependencies.
 * Locale is read from the URL path: /fr/... or /en/...
 * Messages are passed down from [locale]/layout.tsx via React context.
 */

import { createContext, useContext, ReactNode } from 'react';
import type en from '../../../messages/en.json';

export type Locale = 'fr' | 'en';
export type Messages = typeof en;

// Nested key access: t('projects.title')
type NestedKey<T> = T extends object
  ? { [K in keyof T]: K extends string
      ? T[K] extends object
        ? `${K}.${NestedKey<T[K]>}` | K
        : K
      : never }[keyof T]
  : never;

export type MessageKey = NestedKey<Messages>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj) as string ?? path;
}

// ─── Context ────────────────────────────────────────────────────────────────
interface I18nContextType {
  locale: Locale;
  messages: Messages;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'fr',
  messages: {} as Messages,
});

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, messages }}>
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useTranslations(namespace: string) {
  const { messages } = useContext(I18nContext);
  return (key: string) => {
    const fullKey = `${namespace}.${key}`;
    return getNestedValue(messages as unknown as Record<string, unknown>, fullKey);
  };
}

export function useLocale(): Locale {
  return useContext(I18nContext).locale;
}
