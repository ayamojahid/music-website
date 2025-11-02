import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddLikeToSongData {
  like_insert: Like_Key;
}

export interface AddLikeToSongVariables {
  songId: UUIDString;
}

export interface AddSongToPlaylistData {
  playlistSong_insert: PlaylistSong_Key;
}

export interface AddSongToPlaylistVariables {
  playlistId: UUIDString;
  songId: UUIDString;
  positionInPlaylist: number;
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateNewPlaylistData {
  playlist_insert: Playlist_Key;
}

export interface CreateNewPlaylistVariables {
  name: string;
  description?: string | null;
  isPublic: boolean;
}

export interface GetPublicPlaylistsData {
  playlists: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Playlist_Key)[];
}

export interface Like_Key {
  id: UUIDString;
  __typename?: 'Like_Key';
}

export interface PlaylistSong_Key {
  playlistId: UUIDString;
  songId: UUIDString;
  __typename?: 'PlaylistSong_Key';
}

export interface Playlist_Key {
  id: UUIDString;
  __typename?: 'Playlist_Key';
}

export interface Song_Key {
  id: UUIDString;
  __typename?: 'Song_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateNewPlaylistRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewPlaylistVariables): MutationRef<CreateNewPlaylistData, CreateNewPlaylistVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewPlaylistVariables): MutationRef<CreateNewPlaylistData, CreateNewPlaylistVariables>;
  operationName: string;
}
export const createNewPlaylistRef: CreateNewPlaylistRef;

export function createNewPlaylist(vars: CreateNewPlaylistVariables): MutationPromise<CreateNewPlaylistData, CreateNewPlaylistVariables>;
export function createNewPlaylist(dc: DataConnect, vars: CreateNewPlaylistVariables): MutationPromise<CreateNewPlaylistData, CreateNewPlaylistVariables>;

interface GetPublicPlaylistsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPublicPlaylistsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPublicPlaylistsData, undefined>;
  operationName: string;
}
export const getPublicPlaylistsRef: GetPublicPlaylistsRef;

export function getPublicPlaylists(): QueryPromise<GetPublicPlaylistsData, undefined>;
export function getPublicPlaylists(dc: DataConnect): QueryPromise<GetPublicPlaylistsData, undefined>;

interface AddSongToPlaylistRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddSongToPlaylistVariables): MutationRef<AddSongToPlaylistData, AddSongToPlaylistVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddSongToPlaylistVariables): MutationRef<AddSongToPlaylistData, AddSongToPlaylistVariables>;
  operationName: string;
}
export const addSongToPlaylistRef: AddSongToPlaylistRef;

export function addSongToPlaylist(vars: AddSongToPlaylistVariables): MutationPromise<AddSongToPlaylistData, AddSongToPlaylistVariables>;
export function addSongToPlaylist(dc: DataConnect, vars: AddSongToPlaylistVariables): MutationPromise<AddSongToPlaylistData, AddSongToPlaylistVariables>;

interface AddLikeToSongRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddLikeToSongVariables): MutationRef<AddLikeToSongData, AddLikeToSongVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddLikeToSongVariables): MutationRef<AddLikeToSongData, AddLikeToSongVariables>;
  operationName: string;
}
export const addLikeToSongRef: AddLikeToSongRef;

export function addLikeToSong(vars: AddLikeToSongVariables): MutationPromise<AddLikeToSongData, AddLikeToSongVariables>;
export function addLikeToSong(dc: DataConnect, vars: AddLikeToSongVariables): MutationPromise<AddLikeToSongData, AddLikeToSongVariables>;

