'use client';

import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 text-center z-50">
      <span className="font-medium">Offline mode</span> - Changes will sync when connection restored
    </div>
  );
}
