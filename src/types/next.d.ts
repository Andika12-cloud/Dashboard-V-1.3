declare module 'next/navigation' {
  export interface AppRouterInstance {
    push(href: string, options?: { scroll?: boolean }): void;
    replace(href: string, options?: { scroll?: boolean }): void;
    back(): void;
    forward(): void;
    refresh(): void;
    prefetch(href: string, options?: { kind?: any }): void;
  }
  export function useRouter(): AppRouterInstance;
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
}
