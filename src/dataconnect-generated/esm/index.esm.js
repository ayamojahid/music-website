import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'web22',
  location: 'us-east4'
};

export const createNewPlaylistRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewPlaylist', inputVars);
}
createNewPlaylistRef.operationName = 'CreateNewPlaylist';

export function createNewPlaylist(dcOrVars, vars) {
  return executeMutation(createNewPlaylistRef(dcOrVars, vars));
}

export const getPublicPlaylistsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublicPlaylists');
}
getPublicPlaylistsRef.operationName = 'GetPublicPlaylists';

export function getPublicPlaylists(dc) {
  return executeQuery(getPublicPlaylistsRef(dc));
}

export const addSongToPlaylistRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddSongToPlaylist', inputVars);
}
addSongToPlaylistRef.operationName = 'AddSongToPlaylist';

export function addSongToPlaylist(dcOrVars, vars) {
  return executeMutation(addSongToPlaylistRef(dcOrVars, vars));
}

export const addLikeToSongRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddLikeToSong', inputVars);
}
addLikeToSongRef.operationName = 'AddLikeToSong';

export function addLikeToSong(dcOrVars, vars) {
  return executeMutation(addLikeToSongRef(dcOrVars, vars));
}

