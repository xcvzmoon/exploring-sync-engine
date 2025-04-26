import { DatabaseStorage } from '../types/database-storage';

export class SyncEngine {
  private _clientDatabaseStorage: DatabaseStorage;
  private _serverDatabaseStorage: DatabaseStorage;
  private _lastSyncedTime: number;

  constructor(
    clientDatabaseStorage: DatabaseStorage,
    serverDatabaseStorage: DatabaseStorage,
  ) {
    this._clientDatabaseStorage = clientDatabaseStorage;
    this._serverDatabaseStorage = serverDatabaseStorage;
    this._lastSyncedTime = 0;
  }

  async sync(): Promise<void> {
    console.log(
      `\n[Start] Sync: ${new Date(this._lastSyncedTime).toISOString()}`,
    );

    const syncStartTime = Date.now();

    try {
      const clientItems = this._clientDatabaseStorage.selectAll();
      const unsyncedClientItems = clientItems.filter((clientItem) => {
        return clientItem.lastUpdated > this._lastSyncedTime;
      });

      console.log(`${unsyncedClientItems.length} unsynced client items.`);

      const serverItems = this._serverDatabaseStorage.selectAll();
      const unsyncedServerItems = serverItems.filter((serverItem) => {
        return serverItem.lastUpdated > this._lastSyncedTime;
      });

      console.log(`${unsyncedServerItems.length} unsynced server items.`);

      if (unsyncedClientItems.length) {
        console.log('Syncing to server');
        this._serverDatabaseStorage.synchronize(unsyncedClientItems);
      }

      if (unsyncedServerItems.length) {
        console.log('Updating client');
        this._clientDatabaseStorage.synchronize(unsyncedServerItems);
      }

      this._lastSyncedTime = syncStartTime;

      console.log(
        `[End] Sync: ${new Date(this._lastSyncedTime).toISOString()}`,
      );
    } catch (error) {
      console.error('An error occured while syncing', error);
    }
  }
}
