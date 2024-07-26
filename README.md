# LocalStorageClient

`LocalStorageClient` is a simple, TypeScript-based wrapper for `localStorage` that allows you to easily manage CRUD operations on a named table. It supports type safety, error handling, pagination, and more.

## Installation

Install the package via npm:

```bash
npm install local-storage-client
```

## Usage

### Importing and Initializing

First, import and create an instance of `LocalStorageClient`:

```typescript
import LocalStorageClient from 'local-storage-client';

interface Item {
  name: string;
  value: number;
}

const client = new LocalStorageClient<Item>('myTableName');
```

### Insert

Insert a new item into the table:

```typescript
const newItem = client.insert({ name: 'item1', value: 100 });
console.log(newItem); // { id: 1625198544123, name: 'item1', value: 100 }
```

### Select

Select items from the table with optional query and pagination:

```typescript
const items = client.select({ name: 'item1' }, 1, 10);
console.log(items); // Array of items matching the query
```

### Update

Update items in the table that match the query:

```typescript
const updatedItems = client.update({ name: 'item1' }, { value: 200 });
console.log(updatedItems); // Array of updated items
```

### Delete

Delete items from the table that match the query:

```typescript
const deletedCount = client.delete({ name: 'item1' });
console.log(deletedCount); // Number of items deleted
```

### Clear

Clear all items from the table:

```typescript
client.clear();
```

## How `id` Works

When you insert a new item into the table, `LocalStorageClient` automatically assigns a unique `id` to the item if it doesn't already have one. This `id` is generated using the current timestamp (`Date.now()`). This ensures that each item has a unique identifier, which can be useful for subsequent operations like update or delete.

For example:

```typescript
const newItem = client.insert({ name: 'item1', value: 100 });
console.log(newItem); // { id: 1625198544123, name: 'item1', value: 100 }
```

Here, the `id` is `1625198544123`, which is the timestamp when the item was inserted.

## Type Safety

`LocalStorageClient` supports type safety for the items stored in the table. Define an interface for your item type and use it when creating an instance of `LocalStorageClient`.

```typescript
interface Item {
  id?: number;
  name: string;
  value: number;
}

const client = new LocalStorageClient<Item>('myTableName');
```

## Error Handling

The library includes basic error handling for reading from and writing to `localStorage`. Errors are logged to the console.

# LocalStorageClient

`LocalStorageClient` is a simple, TypeScript-based wrapper for `localStorage` that allows you to easily manage CRUD operations on a named table. It supports type safety, error handling, pagination, and more.

## Installation

Install the package via npm:

```bash
npm install local-storage-client
```

## Usage

### Importing and Initializing

First, import and create an instance of `LocalStorageClient`:

```typescript
import LocalStorageClient from 'local-storage-client';

interface Item {
  name: string;
  value: number;
}

const client = new LocalStorageClient<Item>('myTableName');
```

### Insert

Insert a new item into the table:

```typescript
const newItem = client.insert({ name: 'item1', value: 100 });
console.log(newItem); // { id: 1625198544123, name: 'item1', value: 100 }
```

### Select

Select items from the table with optional query and pagination:

```typescript
const items = client.select({ name: 'item1' }, 1, 10);
console.log(items); // Array of items matching the query
```

### Update

Update items in the table that match the query:

```typescript
const updatedItems = client.update({ name: 'item1' }, { value: 200 });
console.log(updatedItems); // Array of updated items
```

### Delete

Delete items from the table that match the query:

```typescript
const deletedCount = client.delete({ name: 'item1' });
console.log(deletedCount); // Number of items deleted
```

### Clear

Clear all items from the table:

```typescript
client.clear();
```

## How `id` Works

When you insert a new item into the table, `LocalStorageClient` automatically assigns a unique `id` to the item if it doesn't already have one. This `id` is generated using the current timestamp (`Date.now()`). This ensures that each item has a unique identifier, which can be useful for subsequent operations like update or delete.

For example:

```typescript
const newItem = client.insert({ name: 'item1', value: 100 });
console.log(newItem); // { id: 1625198544123, name: 'item1', value: 100 }
```

Here, the `id` is `1625198544123`, which is the timestamp when the item was inserted.

## Type Safety

`LocalStorageClient` supports type safety for the items stored in the table. Define an interface for your item type and use it when creating an instance of `LocalStorageClient`.

```typescript
interface Item {
  id?: number;
  name: string;
  value: number;
}

const client = new LocalStorageClient<Item>('myTableName');
```

## Error Handling

The library includes basic error handling for reading from and writing to `localStorage`. Errors are logged to the console.
