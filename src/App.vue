<template>
  <div id="app">
    <h1>Delete Spotify Playlists</h1>
    <div>
      <input type="text" placeholder="Type to filter" v-model="filterText"/>
      <button @click="deleteAllPlaylists">Delete all</button>
      <button @click="followAllPlaylists">Revert all</button>
    </div>
    <ol>
      <li v-for="playlist in playlistsFiltered" :key="playlist.id">
        <PlaylistItem
          :playlist="playlist"
          @delete="deletePlaylist(playlist)"
          @follow="followPlaylist(playlist)"
        />
      </li>
    </ol>
    <Login v-if="!token.length" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { deletePlaylist, getPlaylists, followPlaylist } from './rest'
import Login from './components/Login.vue'
import PlaylistItem from './components/PlaylistItem.vue'
import { Playlist, SuccessPayload, GetPlaylistsPayload } from './types'

@Component({
  components: { Login, PlaylistItem }
})
export default class App extends Vue {
  token: string = ''
  playlists: Playlist[] = []
  playlistsTotal: number = 0
  playlistsLimit: number = 50
  filterText: string = ''

  get playlistsFiltered (): Playlist[] {
    if (this.filterText === '') {
      return this.playlists
    }
    return this.playlists.filter(
      playlist => playlist.name.toLowerCase().includes(this.filterText.toLowerCase())
    )
  }

  get playlistTotalPages (): number {
    return Math.ceil(this.playlistsTotal / this.playlistsLimit)
  }

  mounted () {
    this.getUrlToken()
    if (this.token) {
      this.getAllPlaylists()
    }
  }

  getUrlToken () {
    const urlParam = window.location.hash.split('access_token=')[1]
    if (urlParam) {
      this.token = urlParam.split('&')[0]
    }
  }

  async getAllPlaylists () {
    await this.getPlaylists() // first call to find total amount

    for (let index = 1; index < this.playlistTotalPages; index += 1) {
      this.getPlaylists(index * this.playlistsLimit)
    }
  }

  getPlaylists (offset: number = 0) {
    return getPlaylists(this.token, offset, this.playlistsLimit)
      .then((payload: GetPlaylistsPayload) => {
        this.playlists = this.playlists.concat(payload.playlists)
        this.playlistsTotal = payload.total
      })
  }

  deletePlaylist (playlist: Playlist) {
    return deletePlaylist(this.token, playlist.id)
      .then((payload: SuccessPayload) => {
        if (payload.success === false) { return }

        playlist.isUnfollowed = true
      })
  }

  followPlaylist (playlist: Playlist) {
    return followPlaylist(this.token, playlist.id)
      .then((payload: SuccessPayload) => {
        if (payload.success === false) { return }

        playlist.isUnfollowed = false
      })
  }

  deleteAllPlaylists () {
    this.playlistsFiltered.forEach(
      playlist => {
        if (!playlist.isUnfollowed) {
          this.deletePlaylist(playlist)
        }
      }
    )
  }

  followAllPlaylists () {
    this.playlistsFiltered.forEach(
      playlist => {
        if (playlist.isUnfollowed) {
          this.followPlaylist(playlist)
        }
      }
    )
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
