const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'web22',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createNewPlaylistRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewPlaylist', inputVars);
}
createNewPlaylistRef.operationName = 'CreateNewPlaylist';
exports.createNewPlaylistRef = createNewPlaylistRef;

exports.createNewPlaylist = function createNewPlaylist(dcOrVars, vars) {
  return executeMutation(createNewPlaylistRef(dcOrVars, vars));
};

const getPublicPlaylistsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublicPlaylists');
}
getPublicPlaylistsRef.operationName = 'GetPublicPlaylists';
exports.getPublicPlaylistsRef = getPublicPlaylistsRef;

exports.getPublicPlaylists = function getPublicPlaylists(dc) {
  return executeQuery(getPublicPlaylistsRef(dc));
};

const addSongToPlaylistRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddSongToPlaylist', inputVars);
}
addSongToPlaylistRef.operationName = 'AddSongToPlaylist';
exports.addSongToPlaylistRef = addSongToPlaylistRef;

exports.addSongToPlaylist = function addSongToPlaylist(dcOrVars, vars) {
  return executeMutation(addSongToPlaylistRef(dcOrVars, vars));
};

const addLikeToSongRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddLikeToSong', inputVars);
}
addLikeToSongRef.operationName = 'AddLikeToSong';
exports.addLikeToSongRef = addLikeToSongRef;

exports.addLikeToSong = function addLikeToSong(dcOrVars, vars) {
  return executeMutation(addLikeToSongRef(dcOrVars, vars));
};
