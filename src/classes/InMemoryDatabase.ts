import type { Item, ReturnItem } from '../types/item';
import { DatabaseStorage } from '../types/database-storage';

export class InMemoryDatabase implements DatabaseStorage {
  private _items: Map<string, Item> = new Map();

  insert(content: string): Item {
    const item: Item = {
      uuid: crypto.randomUUID(),
      content,
      lastUpdated: Date.now(),
    };

    this._items.set(item.uuid, item);

    return item;
  }

  select(uuid: string): Item | undefined {
    return this._items.get(uuid);
  }

  selectAll(): Item[] {
    return Array.from(this._items.values());
  }

  update(uuid: string, content: string): ReturnItem {
    const item = this.select(uuid);

    if (!item) {
      return { error: 'Invalid UUID' };
    }

    item.content = content;
    item.lastUpdated = Date.now();

    this._items.set(item.uuid, item);

    return { data: item };
  }

  synchronize(items: Item[]): void {
    items.forEach((item) => {
      const _item = this._items.get(item.uuid);

      if (!_item || item.lastUpdated > _item.lastUpdated) {
        this._items.set(item.uuid, item);
        console.log('  updating', item.content);
      }
    });
  }
}
