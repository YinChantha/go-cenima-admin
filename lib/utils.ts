import { ColumnDef } from '@tanstack/react-table';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date into "MMM dd, yyyy" (e.g. Jul 21, 2025)
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

/**
 * Format time as "HH:mm AM/PM" (e.g. 11:55 AM)
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}


export function excludeColumnsFrom<T>(
  columns: ColumnDef<T>[],
  exclude: string[]
): ColumnDef<T>[] {
  return columns.filter((col:any) => {
    const key = typeof col.accessorKey === "string" ? col.accessorKey : null;
    return key ? !exclude.includes(key) : true;
  });
}