import { CreateNewPlaylistData, CreateNewPlaylistVariables, GetPublicPlaylistsData, AddSongToPlaylistData, AddSongToPlaylistVariables, AddLikeToSongData, AddLikeToSongVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewPlaylist(options?: useDataConnectMutationOptions<CreateNewPlaylistData, FirebaseError, CreateNewPlaylistVariables>): UseDataConnectMutationResult<CreateNewPlaylistData, CreateNewPlaylistVariables>;
export function useCreateNewPlaylist(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewPlaylistData, FirebaseError, CreateNewPlaylistVariables>): UseDataConnectMutationResult<CreateNewPlaylistData, CreateNewPlaylistVariables>;

export function useGetPublicPlaylists(options?: useDataConnectQueryOptions<GetPublicPlaylistsData>): UseDataConnectQueryResult<GetPublicPlaylistsData, undefined>;
export function useGetPublicPlaylists(dc: DataConnect, options?: useDataConnectQueryOptions<GetPublicPlaylistsData>): UseDataConnectQueryResult<GetPublicPlaylistsData, undefined>;

export function useAddSongToPlaylist(options?: useDataConnectMutationOptions<AddSongToPlaylistData, FirebaseError, AddSongToPlaylistVariables>): UseDataConnectMutationResult<AddSongToPlaylistData, AddSongToPlaylistVariables>;
export function useAddSongToPlaylist(dc: DataConnect, options?: useDataConnectMutationOptions<AddSongToPlaylistData, FirebaseError, AddSongToPlaylistVariables>): UseDataConnectMutationResult<AddSongToPlaylistData, AddSongToPlaylistVariables>;

export function useAddLikeToSong(options?: useDataConnectMutationOptions<AddLikeToSongData, FirebaseError, AddLikeToSongVariables>): UseDataConnectMutationResult<AddLikeToSongData, AddLikeToSongVariables>;
export function useAddLikeToSong(dc: DataConnect, options?: useDataConnectMutationOptions<AddLikeToSongData, FirebaseError, AddLikeToSongVariables>): UseDataConnectMutationResult<AddLikeToSongData, AddLikeToSongVariables>;
