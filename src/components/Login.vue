<template>
  <a :href="url">Login</a>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SPOTIFY_CLIENT_ID, SPOTIFY_SCOPES } from '../constants'

@Component
export default class Login extends Vue {
  get url (): string {
    return 'https://accounts.spotify.com/authorize?client_id=' + SPOTIFY_CLIENT_ID +
      '&redirect_uri=' + encodeURIComponent(this.redirectUri) +
      '&scope=' + encodeURIComponent(SPOTIFY_SCOPES.join(' ')) +
      '&response_type=token'
  }

  get redirectUri (): string {
    return location.protocol + '//' + location.host + location.pathname
  }
}
</script>

<style>
</style>
