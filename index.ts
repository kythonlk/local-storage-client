type Query<T> = Partial<Record<keyof T, T[keyof T]>>;

class LocalStorageClient<T extends { id?: number }> {
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
}

export default LocalStorageClient;
