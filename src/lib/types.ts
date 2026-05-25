export interface Store {
  id: string;
  name: string;
  created_at: string;
  uncheckedCount?: number;
}

export interface Item {
  id: string;
  name: string;
  store_id: string;
  is_favorite: boolean;
  created_at: string;
  isChecked?: boolean;
  lastChecked?: string | null;
}

export interface ItemAction {
  id: string;
  item_id: string;
  action: 'checked' | 'unchecked';
  timestamp: string;
}

export interface ItemWithStatus extends Item {
  isChecked: boolean;
  lastChecked: string | null;
}

export interface Suggestion {
  id: string;
  name: string;
  isFavorite: boolean;
  checkCount: number;
}
