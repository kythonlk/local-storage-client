/**
 * Type definition for querying data in the table.
 * @template T - The type of the table data.
 */
type Query<T> = Partial<Record<keyof T, T[keyof T]>>;

/**
 * A class to manage local storage tables with CRUD operations and synchronization with remote APIs.
 * @template T - The type of the data stored in the table.
 */
class LocalStorageTable<T extends { id?: number }> {
  private tableName: string;

  /**
   * Creates an instance of LocalStorageTable.
   * @param tableName - The name of the table in local storage.
   */
  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Retrieves the table data from local storage.
   * @returns An array of data items from local storage.
   */
  private _getTable(): T[] {
    try {
      return JSON.parse(localStorage.getItem(this.tableName) || '[]') as T[];
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return [];
    }
  }

  /**
   * Saves the table data to local storage.
   * @param data - An array of data items to save.
   */
  private _setTable(data: T[]): void {
    try {
      localStorage.setItem(this.tableName, JSON.stringify(data));
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  }

  /**
   * Inserts a new item into the table.
   * @param item - The item to insert.
   * @returns The inserted item, with a generated ID.
   */
  public insert(item: T): T {
    const table = this._getTable();
    item.id = Date.now();
    table.push(item);
    this._setTable(table);
    return item;
  }

  /**
   * Selects items from the table based on a query.
   * @param query - The query to filter items by.
   * @param page - The page number for pagination (default is 1).
   * @param limit - The number of items per page (default is 10).
   * @returns An array of items that match the query.
   */
  public select(query: Query<T> = {}, page: number = 1, limit: number = 10): T[] {
    const table = this._getTable();
    const filtered = table.filter(item =>
      Object.keys(query).every(key => item[key] === query[key])
    );
    const startIndex = (page - 1) * limit;
    return filtered.slice(startIndex, startIndex + limit);
  }

  /**
   * Updates items in the table that match a query.
   * @param query - The query to match items to update.
   * @param updates - The updates to apply to matching items.
   * @returns An array of updated items.
   */
  public update(query: Query<T>, updates: Partial<T>): T[] {
    const table = this._getTable();
    const updatedTable = table.map(item => {
      if (Object.keys(query).every(key => item[key] === query[key])) {
        return { ...item, ...updates };
      }
      return item;
    });
    this._setTable(updatedTable);
    return this.select(query);
  }

  /**
   * Deletes items from the table that match a query.
   * @param query - The query to match items to delete.
   * @returns The number of items deleted.
   */
  public delete(query: Query<T>): number {
    const table = this._getTable();
    const newTable = table.filter(item =>
      !Object.keys(query).every(key => item[key] === query[key])
    );
    this._setTable(newTable);
    return table.length - newTable.length;
  }

  /**
   * Clears all items from the table.
   */
  public clear(): void {
    this._setTable([]);
  }

  /**
   * Fetches data from an API and stores it in a local storage table periodically.
   * @param apiUrl - The API URL to fetch data from.
   * @param timeInterval - The interval (in milliseconds) to fetch data.
   * @param dataTableName - The local storage table name to store the data.
   * @param headers - Optional headers to include in the API request.
   */
  public async fetchData(apiUrl: string, timeInterval: number, dataTableName: string, headers: HeadersInit = {}): Promise<void> {
    const fetchAndStoreData = async () => {
      try {
        const response = await fetch(apiUrl, { headers });
        const data = await response.json();
        const client = new LocalStorageTable<T>(dataTableName);
        client._setTable(data);
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };

    await fetchAndStoreData(); // Initial fetch
    setInterval(fetchAndStoreData, timeInterval); // Fetch data periodically
  }

  /**
   * Synchronizes the local storage table data with a remote API using POST requests periodically.
   * @param apiUrl - The API URL to post data to.
   * @param tableName - The local storage table name to synchronize.
   * @param timeInterval - The interval (in milliseconds) to synchronize data.
   * @param headers - Optional headers to include in the API request.
   */
  public async syncPost(apiUrl: string, tableName: string, timeInterval: number, headers: HeadersInit = {}): Promise<void> {
    const sync = async () => {
      const client = new LocalStorageTable<T>(tableName);
      const table = client._getTable();
      for (const item of table) {
        try {
          await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
            body: JSON.stringify(item),
          });
        } catch (error) {
          console.error('Error posting data to API:', error);
        }
      }
    };

    await sync(); // Initial sync
    setInterval(sync, timeInterval); // Sync data periodically
  }

  /**
   * Synchronizes the local storage table data with a remote API using PUT requests periodically.
   * @param apiUrl - The API URL to update data at.
   * @param tableName - The local storage table name to synchronize.
   * @param timeInterval - The interval (in milliseconds) to synchronize data.
   * @param headers - Optional headers to include in the API request.
   */
  public async syncUpdate(apiUrl: string, tableName: string, timeInterval: number, headers: HeadersInit = {}): Promise<void> {
    const sync = async () => {
      const client = new LocalStorageTable<T>(tableName);
      const table = client._getTable();
      for (const item of table) {
        try {
          await fetch(apiUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
            body: JSON.stringify(item),
          });
        } catch (error) {
          console.error('Error updating data in API:', error);
        }
      }
    };

    await sync(); // Initial sync
    setInterval(sync, timeInterval); // Sync data periodically
  }
}

export default LocalStorageTable;
