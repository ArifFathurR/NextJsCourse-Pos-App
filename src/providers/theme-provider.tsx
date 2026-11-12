'use client';

import { ThemeProvider as NestThemeProviders, ThemeProviderProps } from "next-themes";


export function ThemeProvider ({children, ...props}: ThemeProviderProps) {
    return <NestThemeProviders {...props}>{children}</NestThemeProviders>
}