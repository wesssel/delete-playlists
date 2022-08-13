export interface Playlist {
  name: string
  id: string
  url: string
  isUnfollowed: boolean
  total_tracks: number
}

export interface GetPlaylistsPayload {
  playlists: Playlist[]
  total: number
}

export interface SuccessPayload {
  success: boolean
}
