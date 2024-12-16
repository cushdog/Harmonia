'use client'

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/Theming/theme-provider';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={clsx(
        theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'
      )}
    >
      {theme === 'light' ? (
        <Sun color='#000000' className="h-5 w-5" />
      ) : (
        <Moon color='#ffffff' className="h-5 w-5" />
      )}
    </Button>
  );
}