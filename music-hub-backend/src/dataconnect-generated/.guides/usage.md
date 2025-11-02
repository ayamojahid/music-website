# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createNewPlaylist, getPublicPlaylists, addSongToPlaylist, addLikeToSong } from '@dataconnect/generated';


// Operation CreateNewPlaylist:  For variables, look at type CreateNewPlaylistVars in ../index.d.ts
const { data } = await CreateNewPlaylist(dataConnect, createNewPlaylistVars);

// Operation GetPublicPlaylists: 
const { data } = await GetPublicPlaylists(dataConnect);

// Operation AddSongToPlaylist:  For variables, look at type AddSongToPlaylistVars in ../index.d.ts
const { data } = await AddSongToPlaylist(dataConnect, addSongToPlaylistVars);

// Operation AddLikeToSong:  For variables, look at type AddLikeToSongVars in ../index.d.ts
const { data } = await AddLikeToSong(dataConnect, addLikeToSongVars);


```