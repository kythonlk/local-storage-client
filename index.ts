type Query<T> = Partial<Record<keyof T, T[keyof T]>>;

class LocalStorageTable<T extends { id?: number }> {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private _getTable(): T[] {
    try {
      return JSON.parse(localStorage.getItem(this.tableName) || '[]') as T[];
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return [];
    }
  }

  private _setTable(data: T[]): void {
    try {
      localStorage.setItem(this.tableName, JSON.stringify(data));
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  }

  public insert(item: T): T {
    const table = this._getTable();
    item.id = Date.now();
    table.push(item);
    this._setTable(table);
    return item;
  }

  public select(query: Query<T> = {}, page: number = 1, limit: number = 10): T[] {
    const table = this._getTable();
    const filtered = table.filter(item =>
      Object.keys(query).every(key => item[key] === query[key])
    );
    const startIndex = (page - 1) * limit;
    return filtered.slice(startIndex, startIndex + limit);
  }

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

  public delete(query: Query<T>): number {
    const table = this._getTable();
    const newTable = table.filter(item =>
      !Object.keys(query).every(key => item[key] === query[key])
    );
    this._setTable(newTable);
    return table.length - newTable.length;
  }

  public clear(): void {
    this._setTable([]);
  }

  public async fetchData(apiUrl: string, timeInterval: number, dataTableName: string, headers: HeadersInit = {}): Promise<void> {
    const fetchAndStoreData = async () => {
      try {
        const response = await fetch(apiUrl, { headers });
        const data = await response.json();
        const client = new LocalStorageTable(dataTableName);
        client._setTable(data);
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };

    await fetchAndStoreData(); setInterval(fetchAndStoreData, timeInterval);
  }

  public async post(apiUrl: string, data: T, headers: HeadersInit = {}): Promise<void> {
    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error posting data to API:', error);
    }
  }

  public async updateData(apiUrl: string, data: T, headers: HeadersInit = {}): Promise<void> {
    try {
      await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error updating data in API:', error);
    }
  }

  public async deleteData(apiUrl: string, id: number, headers: HeadersInit = {}): Promise<void> {
    try {
      await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });
    } catch (error) {
      console.error('Error deleting data from API:', error);
    }
  }

  public async get(apiUrl: string, headers: HeadersInit = {}): Promise<T[]> {
    try {
      const response = await fetch(apiUrl, { headers });
      return await response.json();
    } catch (error) {
      console.error('Error fetching data from API:', error);
      return [];
    }
  }
}

export default LocalStorageTable;
