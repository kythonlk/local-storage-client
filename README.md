# LocalStorageTable

## How to install

```bash
npm i localstorageclient
```

## Overview

`LocalStorageTable` is a TypeScript class for managing local storage tables with CRUD operations and synchronization with remote APIs. This document provides examples of how to use each method and option.

## 1. Basic Operations

### Initial Setup

Create an instance of `LocalStorageTable`:

```typescript
const tableName = 'myTable';
const storageTable = new LocalStorageTable<MyDataType>(tableName);
```

Replace `MyDataType` with your specific data type.

### Insert Data

```typescript
const newItem = { name: 'John Doe', age: 30 };
const insertedItem = storageTable.insert(newItem);
console.log('Inserted Item:', insertedItem);
```

### Select Data

```typescript
const query = { name: 'John Doe' };
const selectedItems = storageTable.select(query);
console.log('Selected Items:', selectedItems);
```

### Update Data

```typescript
const query = { name: 'John Doe' };
const updates = { age: 31 };
const updatedItems = storageTable.update(query, updates);
console.log('Updated Items:', updatedItems);
```

### Delete Data

```typescript
const query = { name: 'John Doe' };
const deletedCount = storageTable.delete(query);
console.log('Number of Deleted Items:', deletedCount);
```

### Clear Data

```typescript
storageTable.clear();
console.log('Table Cleared');
```

## 2. Synchronization with API

### Fetch Data from API

Fetch data from an API and store it in a local storage table periodically:

```typescript
const apiUrl = 'https://api.example.com/data';
const timeInterval = 3600000; // 1 hour
const dataTableName = 'fetchedData';
const headers = { 'Authorization': 'Bearer token' };

storageTable.fetchData(apiUrl, timeInterval, dataTableName, headers)
  .then(() => console.log('Data fetch and sync started'))
  .catch(error => console.error('Error fetching data:', error));
```

### Synchronize Data with API using POST

Synchronize local storage table data with a remote API using POST requests periodically:

```typescript
const postApiUrl = 'https://api.example.com/data';
const postTableName = 'localTable';
const postInterval = 3600000; // 1 hour
const postHeaders = { 'Authorization': 'Bearer token' };

storageTable.syncPost(postApiUrl, postTableName, postInterval, postHeaders)
  .then(() => console.log('POST synchronization started'))
  .catch(error => console.error('Error synchronizing data with POST:', error));
```

## Notes

- Ensure the API URLs and headers match your specific requirements.
- Adjust the time intervals as needed for your use case.
- Handle errors appropriately based on your application's needs.

Feel free to modify and adapt these examples to fit your specific implementation and use cases.
