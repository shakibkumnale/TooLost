// ═══════════════════════════════════════════
// Too Lost API Endpoint Functions
// ═══════════════════════════════════════════

import api from './api';

// ── User ──────────────────────────────────

export const getMe = () => api.get('/me');

// ── Releases ──────────────────────────────

export const listReleases = (params) => api.get('/releases', params);

export const getRelease = (id) => api.get(`/releases/${id}`);

export const createRelease = (data) => api.post('/releases', data);

export const updateReleaseMetadata = (id, data) => api.patch(`/releases/${id}/metadata`, data);

export const updateReleaseDelivery = (id, data) => api.patch(`/releases/${id}/delivery`, data);

export const updateReleaseVideo = (id, data) => api.patch(`/releases/${id}/video`, data);

export const submitRelease = (id, data) => api.post(`/releases/${id}/submit`, data);

export const deleteRelease = (id) => api.delete(`/releases/${id}`);

export const validateUPC = (upc) => api.post('/releases/validate/upc', { upc });

// ── Release Tracks ────────────────────────

export const listTracks = (releaseId) => api.get(`/releases/${releaseId}/tracks`);

export const getTrack = (releaseId, trackId) => api.get(`/releases/${releaseId}/tracks/${trackId}`);

export const updateTrackFile = (releaseId, trackId, data) => api.patch(`/releases/${releaseId}/tracks/${trackId}`, data);

export const createTrackUploadUrl = (releaseId, data) => api.post(`/releases/${releaseId}/tracks/upload-url`, data);

export const validateISRC = (isrc) => api.post('/releases/validate/isrc', { isrc });

export const updateReleaseTracks = (releaseId, data) => api.put(`/releases/${releaseId}/tracks`, data);

// ── Preferences ───────────────────────────

export const getArtistPreferences = () => api.get('/preferences/artist');

export const getPreferenceArtists = () => api.get('/preferences/artists');

export const getLabelPreferences = () => api.get('/preferences/label');

export const getLabelArtist = () => api.get('/preferences/label/artist');

export const searchSpotifyArtists = (params) => api.get('/preferences/search/spotify', params);

export const searchYoutubeChannels = (params) => api.get('/preferences/search/youtube', params);

export const searchAppleMusicArtists = (params) => api.get('/preferences/search/apple-music', params);

export const getSpotifyArtist = (id) => api.get(`/preferences/spotify/${id}`);

export const getYoutubeChannel = (id) => api.get(`/preferences/youtube/${id}`);

export const getAppleMusicArtist = (id) => api.get(`/preferences/apple-music/${id}`);

export const getArtistViaLink = (params) => api.get('/preferences/artist/link', params);

export const searchArtistViaPlatform = (data) => api.post('/preferences/search/platform', data);

export const getArtistViaUrl = (data) => api.post('/preferences/artist/url', data);

export const submitArtistPreferences = (data) => api.post('/preferences/artist', data);

export const submitLabelPreferences = (data) => api.post('/preferences/label', data);

export const removeArtist = (data) => api.post('/preferences/artist/remove', data);

// ── Sales: Overview ───────────────────────

export const listMonthlyOverview = (params) => api.get('/sales/overview', params);

// ── Sales: Tracks ─────────────────────────

export const listTrackSales = (params) => api.get('/sales/tracks', params);

export const getTrackSalesOverview = (trackId, params) => api.get(`/sales/tracks/${trackId}`, params);

export const getTrackChannels = (trackId, params) => api.get(`/sales/tracks/${trackId}/channels`, params);

export const getTrackTerritories = (trackId, params) => api.get(`/sales/tracks/${trackId}/territories`, params);

// ── Sales: Releases ───────────────────────

export const listReleaseSales = (params) => api.get('/sales/releases', params);

export const getReleaseSalesOverview = (releaseId, params) => api.get(`/sales/releases/${releaseId}`, params);

export const getReleaseChannels = (releaseId, params) => api.get(`/sales/releases/${releaseId}/channels`, params);

export const getReleaseTerritories = (releaseId, params) => api.get(`/sales/releases/${releaseId}/territories`, params);

// ── Sales: Artists ────────────────────────

export const listArtistSales = (params) => api.get('/sales/artists', params);

export const getArtistSalesOverview = (artistId, params) => api.get(`/sales/artists/${artistId}`, params);

export const getArtistChannels = (artistId, params) => api.get(`/sales/artists/${artistId}/channels`, params);

export const getArtistTerritories = (artistId, params) => api.get(`/sales/artists/${artistId}/territories`, params);

// ── Sales: Channels ───────────────────────

export const listChannelSales = (params) => api.get('/sales/channels', params);

export const getChannelOverview = (channelId, params) => api.get(`/sales/channels/${channelId}`, params);

export const getChannelReleases = (channelId, params) => api.get(`/sales/channels/${channelId}/releases`, params);

export const getChannelTerritories = (channelId, params) => api.get(`/sales/channels/${channelId}/territories`, params);

// ── Sales: Territories ────────────────────

export const listTerritories = (params) => api.get('/sales/territories', params);

// ── Sales: Stream Rates ───────────────────

export const listStreamRates = (params) => api.get('/sales/stream-rates', params);

export const getStreamRateOverview = (rateId, params) => api.get(`/sales/stream-rates/${rateId}`, params);

export const getStreamRateTerritories = (rateId, params) => api.get(`/sales/stream-rates/${rateId}/territories`, params);

// ── Analytics ─────────────────────────────

export const getAnalyticsOverview = (params) => api.get('/analytics/overview', params);

export const listAnalyticsTracks = (params) => api.get('/analytics/tracks', params);

export const getTrackCharts = (trackId, params) => api.get(`/analytics/tracks/${trackId}/charts`, params);

export const getTrackAnalytics = (trackId, params) => api.get(`/analytics/tracks/${trackId}`, params);

export const listAnalyticsPlatforms = (params) => api.get('/analytics/platforms', params);

export const getPlatformOverviewAnalytics = (platformId, params) => api.get(`/analytics/platforms/${platformId}`, params);

export const getPlatformTotalStreams = (platformId, params) => api.get(`/analytics/platforms/${platformId}/streams`, params);

export const getPlatformAdditionalAnalytics = (platformId, params) => api.get(`/analytics/platforms/${platformId}/additional`, params);

export const getPlatformAdditionalInfoTotals = (platformId, params) => api.get(`/analytics/platforms/${platformId}/additional/totals`, params);

export const getUsageDiscoveryOverview = (params) => api.get('/analytics/usage-discovery', params);

export const listUsageDiscoveryTopSongs = (params) => api.get('/analytics/usage-discovery/top-songs', params);

export const listUsageDiscoveryTrackMatches = (params) => api.get('/analytics/usage-discovery/track-matches', params);

export const listTopReleaseLinks = (params) => api.get('/analytics/top-release-links', params);

// ── Reference Data ────────────────────────

export const listCountries = () => api.get('/countries');

export const listPlatforms = () => api.get('/platforms');

export const listGenres = () => api.get('/genres');

export const listLanguages = () => api.get('/languages');
