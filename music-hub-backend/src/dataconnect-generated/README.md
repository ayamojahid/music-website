# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetPublicPlaylists*](#getpublicplaylists)
- [**Mutations**](#mutations)
  - [*CreateNewPlaylist*](#createnewplaylist)
  - [*AddSongToPlaylist*](#addsongtoplaylist)
  - [*AddLikeToSong*](#addliketosong)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetPublicPlaylists
You can execute the `GetPublicPlaylists` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPublicPlaylists(): QueryPromise<GetPublicPlaylistsData, undefined>;

interface GetPublicPlaylistsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPublicPlaylistsData, undefined>;
}
export const getPublicPlaylistsRef: GetPublicPlaylistsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPublicPlaylists(dc: DataConnect): QueryPromise<GetPublicPlaylistsData, undefined>;

interface GetPublicPlaylistsRef {
  ...
  (dc: DataConnect): QueryRef<GetPublicPlaylistsData, undefined>;
}
export const getPublicPlaylistsRef: GetPublicPlaylistsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPublicPlaylistsRef:
```typescript
const name = getPublicPlaylistsRef.operationName;
console.log(name);
```

### Variables
The `GetPublicPlaylists` query has no variables.
### Return Type
Recall that executing the `GetPublicPlaylists` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPublicPlaylistsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPublicPlaylistsData {
  playlists: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Playlist_Key)[];
}
```
### Using `GetPublicPlaylists`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPublicPlaylists } from '@dataconnect/generated';


// Call the `getPublicPlaylists()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPublicPlaylists();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPublicPlaylists(dataConnect);

console.log(data.playlists);

// Or, you can use the `Promise` API.
getPublicPlaylists().then((response) => {
  const data = response.data;
  console.log(data.playlists);
});
```

### Using `GetPublicPlaylists`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPublicPlaylistsRef } from '@dataconnect/generated';


// Call the `getPublicPlaylistsRef()` function to get a reference to the query.
const ref = getPublicPlaylistsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPublicPlaylistsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.playlists);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.playlists);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewPlaylist
You can execute the `CreateNewPlaylist` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewPlaylist(vars: CreateNewPlaylistVariables): MutationPromise<CreateNewPlaylistData, CreateNewPlaylistVariables>;

interface CreateNewPlaylistRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewPlaylistVariables): MutationRef<CreateNewPlaylistData, CreateNewPlaylistVariables>;
}
export const createNewPlaylistRef: CreateNewPlaylistRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewPlaylist(dc: DataConnect, vars: CreateNewPlaylistVariables): MutationPromise<CreateNewPlaylistData, CreateNewPlaylistVariables>;

interface CreateNewPlaylistRef {
  ...
  (dc: DataConnect, vars: CreateNewPlaylistVariables): MutationRef<CreateNewPlaylistData, CreateNewPlaylistVariables>;
}
export const createNewPlaylistRef: CreateNewPlaylistRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewPlaylistRef:
```typescript
const name = createNewPlaylistRef.operationName;
console.log(name);
```

### Variables
The `CreateNewPlaylist` mutation requires an argument of type `CreateNewPlaylistVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewPlaylistVariables {
  name: string;
  description?: string | null;
  isPublic: boolean;
}
```
### Return Type
Recall that executing the `CreateNewPlaylist` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewPlaylistData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewPlaylistData {
  playlist_insert: Playlist_Key;
}
```
### Using `CreateNewPlaylist`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewPlaylist, CreateNewPlaylistVariables } from '@dataconnect/generated';

// The `CreateNewPlaylist` mutation requires an argument of type `CreateNewPlaylistVariables`:
const createNewPlaylistVars: CreateNewPlaylistVariables = {
  name: ..., 
  description: ..., // optional
  isPublic: ..., 
};

// Call the `createNewPlaylist()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewPlaylist(createNewPlaylistVars);
// Variables can be defined inline as well.
const { data } = await createNewPlaylist({ name: ..., description: ..., isPublic: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewPlaylist(dataConnect, createNewPlaylistVars);

console.log(data.playlist_insert);

// Or, you can use the `Promise` API.
createNewPlaylist(createNewPlaylistVars).then((response) => {
  const data = response.data;
  console.log(data.playlist_insert);
});
```

### Using `CreateNewPlaylist`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewPlaylistRef, CreateNewPlaylistVariables } from '@dataconnect/generated';

// The `CreateNewPlaylist` mutation requires an argument of type `CreateNewPlaylistVariables`:
const createNewPlaylistVars: CreateNewPlaylistVariables = {
  name: ..., 
  description: ..., // optional
  isPublic: ..., 
};

// Call the `createNewPlaylistRef()` function to get a reference to the mutation.
const ref = createNewPlaylistRef(createNewPlaylistVars);
// Variables can be defined inline as well.
const ref = createNewPlaylistRef({ name: ..., description: ..., isPublic: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewPlaylistRef(dataConnect, createNewPlaylistVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.playlist_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.playlist_insert);
});
```

## AddSongToPlaylist
You can execute the `AddSongToPlaylist` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addSongToPlaylist(vars: AddSongToPlaylistVariables): MutationPromise<AddSongToPlaylistData, AddSongToPlaylistVariables>;

interface AddSongToPlaylistRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddSongToPlaylistVariables): MutationRef<AddSongToPlaylistData, AddSongToPlaylistVariables>;
}
export const addSongToPlaylistRef: AddSongToPlaylistRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addSongToPlaylist(dc: DataConnect, vars: AddSongToPlaylistVariables): MutationPromise<AddSongToPlaylistData, AddSongToPlaylistVariables>;

interface AddSongToPlaylistRef {
  ...
  (dc: DataConnect, vars: AddSongToPlaylistVariables): MutationRef<AddSongToPlaylistData, AddSongToPlaylistVariables>;
}
export const addSongToPlaylistRef: AddSongToPlaylistRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addSongToPlaylistRef:
```typescript
const name = addSongToPlaylistRef.operationName;
console.log(name);
```

### Variables
The `AddSongToPlaylist` mutation requires an argument of type `AddSongToPlaylistVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddSongToPlaylistVariables {
  playlistId: UUIDString;
  songId: UUIDString;
  positionInPlaylist: number;
}
```
### Return Type
Recall that executing the `AddSongToPlaylist` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddSongToPlaylistData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddSongToPlaylistData {
  playlistSong_insert: PlaylistSong_Key;
}
```
### Using `AddSongToPlaylist`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addSongToPlaylist, AddSongToPlaylistVariables } from '@dataconnect/generated';

// The `AddSongToPlaylist` mutation requires an argument of type `AddSongToPlaylistVariables`:
const addSongToPlaylistVars: AddSongToPlaylistVariables = {
  playlistId: ..., 
  songId: ..., 
  positionInPlaylist: ..., 
};

// Call the `addSongToPlaylist()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addSongToPlaylist(addSongToPlaylistVars);
// Variables can be defined inline as well.
const { data } = await addSongToPlaylist({ playlistId: ..., songId: ..., positionInPlaylist: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addSongToPlaylist(dataConnect, addSongToPlaylistVars);

console.log(data.playlistSong_insert);

// Or, you can use the `Promise` API.
addSongToPlaylist(addSongToPlaylistVars).then((response) => {
  const data = response.data;
  console.log(data.playlistSong_insert);
});
```

### Using `AddSongToPlaylist`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addSongToPlaylistRef, AddSongToPlaylistVariables } from '@dataconnect/generated';

// The `AddSongToPlaylist` mutation requires an argument of type `AddSongToPlaylistVariables`:
const addSongToPlaylistVars: AddSongToPlaylistVariables = {
  playlistId: ..., 
  songId: ..., 
  positionInPlaylist: ..., 
};

// Call the `addSongToPlaylistRef()` function to get a reference to the mutation.
const ref = addSongToPlaylistRef(addSongToPlaylistVars);
// Variables can be defined inline as well.
const ref = addSongToPlaylistRef({ playlistId: ..., songId: ..., positionInPlaylist: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addSongToPlaylistRef(dataConnect, addSongToPlaylistVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.playlistSong_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.playlistSong_insert);
});
```

## AddLikeToSong
You can execute the `AddLikeToSong` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addLikeToSong(vars: AddLikeToSongVariables): MutationPromise<AddLikeToSongData, AddLikeToSongVariables>;

interface AddLikeToSongRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddLikeToSongVariables): MutationRef<AddLikeToSongData, AddLikeToSongVariables>;
}
export const addLikeToSongRef: AddLikeToSongRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addLikeToSong(dc: DataConnect, vars: AddLikeToSongVariables): MutationPromise<AddLikeToSongData, AddLikeToSongVariables>;

interface AddLikeToSongRef {
  ...
  (dc: DataConnect, vars: AddLikeToSongVariables): MutationRef<AddLikeToSongData, AddLikeToSongVariables>;
}
export const addLikeToSongRef: AddLikeToSongRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addLikeToSongRef:
```typescript
const name = addLikeToSongRef.operationName;
console.log(name);
```

### Variables
The `AddLikeToSong` mutation requires an argument of type `AddLikeToSongVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddLikeToSongVariables {
  songId: UUIDString;
}
```
### Return Type
Recall that executing the `AddLikeToSong` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddLikeToSongData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddLikeToSongData {
  like_insert: Like_Key;
}
```
### Using `AddLikeToSong`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addLikeToSong, AddLikeToSongVariables } from '@dataconnect/generated';

// The `AddLikeToSong` mutation requires an argument of type `AddLikeToSongVariables`:
const addLikeToSongVars: AddLikeToSongVariables = {
  songId: ..., 
};

// Call the `addLikeToSong()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addLikeToSong(addLikeToSongVars);
// Variables can be defined inline as well.
const { data } = await addLikeToSong({ songId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addLikeToSong(dataConnect, addLikeToSongVars);

console.log(data.like_insert);

// Or, you can use the `Promise` API.
addLikeToSong(addLikeToSongVars).then((response) => {
  const data = response.data;
  console.log(data.like_insert);
});
```

### Using `AddLikeToSong`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addLikeToSongRef, AddLikeToSongVariables } from '@dataconnect/generated';

// The `AddLikeToSong` mutation requires an argument of type `AddLikeToSongVariables`:
const addLikeToSongVars: AddLikeToSongVariables = {
  songId: ..., 
};

// Call the `addLikeToSongRef()` function to get a reference to the mutation.
const ref = addLikeToSongRef(addLikeToSongVars);
// Variables can be defined inline as well.
const ref = addLikeToSongRef({ songId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addLikeToSongRef(dataConnect, addLikeToSongVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.like_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.like_insert);
});
```

