<template>
  <div :class="classNames">
    <button v-if="!playlist.isUnfollowed" @click="$emit('delete')">Delete</button>
    <button v-else @click="$emit('follow')">Revert</button>
    {{playlist.name}}
    <a :href="playlist.url" target="_blank">{{playlist.id}}</a> -- Total Tracks: {{playlist.total_tracks}}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Playlist } from '../types'

@Component
export default class PlaylistItem extends Vue {
  @Prop() playlist!: Playlist

  get classNames () {
    return {
      'playlist-item--unfollowed': this.playlist.isUnfollowed
    }
  }
}
</script>

<style>
.playlist-item--unfollowed {
  text-decoration: line-through;
}
</style>
