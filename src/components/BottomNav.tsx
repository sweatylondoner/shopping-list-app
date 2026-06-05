'use client';

import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  {
    id: 'inventory',
    label: 'Inventory',
    icon: '📦',
    path: '/inventory',
  },
  {
    id: 'grocery',
    label: 'Grocery',
    icon: '🛒',
    path: '/',
  },
  {
    id: 'planner',
    label: 'Planner',
    icon: '📅',
    path: '/planner',
  },
  {
    id: 'recipes',
    label: 'Recipes',
    icon: '📖',
    path: '/recipes',
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/') {
      // For grocery, match / and /store/*
      return pathname === '/' || pathname.startsWith('/store');
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center h-16">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  active ? 'text-primary-600' : 'text-gray-600'
                }`}
              >
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className={`text-xs font-medium ${active ? 'text-primary-600' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
