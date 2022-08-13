import axios from 'axios'
import { GetPlaylistsPayload, SuccessPayload } from './types'

const spotifyHost = 'https://api.spotify.com'

export function getPlaylists (token: string, offset: number, limit: number): Promise<GetPlaylistsPayload> {
  return axios.get(`${spotifyHost}/v1/me/playlists?offset=${offset}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => {
    return {
      playlists: res.data.items.map((item: any) => ({
        name: item.name,
        id: item.id,
        url: item.external_urls.spotify,
        isUnfollowed: false,
        total_tracks: item.tracks.total
      })),
      total: res.data.total
    }
  })
}

export function deletePlaylist (token: string, id: string): Promise<SuccessPayload> {
  return axios.delete(`${spotifyHost}/v1/playlists/${id}/followers`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(() => {
      return { success: true }
    })
    .catch(() => {
      return { success: false }
    })
}

export function followPlaylist (token: string, id: string) {
  return axios.put(`${spotifyHost}/v1/playlists/${id}/followers`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(() => {
      return { success: true }
    })
    .catch(() => {
      return { success: false }
    })
}
