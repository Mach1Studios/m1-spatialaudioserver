<template>
  <div id="Playlist" class="flex-item scroll">
    <div class="file-explorer">
      <div class="file-explorer-header">
        <div class="file-explorer-col name-col">Name</div>
      </div>
      <div class="file-explorer-body">
        <div
          v-for="item in playlists"
          :key="item.id"
          class="file-explorer-item"
          :class="{ 'expanded': expandedItems.includes(item.id), 'hovered': hoveredItem === item.id }"
        >
          <div
            class="file-explorer-row"
            @click="toggleExpand(item.id)"
            @mouseenter="hoveredItem = item.id"
            @mouseleave="hoveredItem = null"
          >
            <div class="file-explorer-col name-col">
              <div class="file-item-content">
                <span class="file-caret">
                  <i class="material-icons">{{ expandedItems.includes(item.id) ? 'keyboard_arrow_down' : 'keyboard_arrow_right' }}</i>
                </span>
                <span class="file-icon">
                  <i class="material-icons">folder</i>
                </span>
                <span class="file-name">{{ item.name }}</span>
                <span v-if="item.tracks && item.tracks.length > 0" class="file-count">
                  ({{ item.tracks.length }})
                </span>
                <div v-if="controls" class="file-actions" @click.stop>
                  <button
                    class="file-action-btn"
                    @click="update({ id: item.id, visibility: 'change' })"
                    :title="item.visibility ? 'Make private' : 'Make public'"
                  >
                    <i class="material-icons">{{ item.visibility ? 'visibility' : 'visibility_off' }}</i>
                  </button>
                  <button
                    v-if="item.visibility"
                    class="file-action-btn"
                    @click="copyShareLink(item.id)"
                    :title="'Copy shareable link'"
                  >
                    <i class="material-icons">{{ copiedId === item.id ? 'check' : 'link' }}</i>
                  </button>
                  <Modal
                    title="Rename playlist"
                    button=" "
                    icon="edit"
                    position="medium"
                    padding="no-padding"
                  >
                    <template #button>
                      <button class="file-action-btn" title="Rename playlist">
                        <i class="material-icons">edit</i>
                      </button>
                    </template>
                    <PlaylistForm
                      :id="item.id"
                      :name="item.name"
                      title="Save"
                      icon="save"
                      :action="update"
                    />
                  </Modal>
                  <Modal
                    title="Invite user(s) in playlist"
                    icon="share"
                    position="medium"
                    padding="no-padding"
                    button=" "
                  >
                    <template #button>
                      <button class="file-action-btn" title="Invite users">
                        <i class="material-icons">share</i>
                      </button>
                    </template>
                    <PlaylistInviteForm path="permissions" :playlist="item" :items="users" />
                  </Modal>
                  <button
                    class="file-action-btn"
                    @click="remove(item)"
                    title="Delete playlist"
                  >
                    <i class="material-icons">delete</i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <transition name="slide-down">
            <div v-show="expandedItems.includes(item.id)" class="file-explorer-children">
              <div class="file-explorer-tracks">
                <FileList :user="true" :playlist="item" class="no-scroll playlist-filelist" />
              </div>
              <div v-if="controls" class="file-explorer-add-tracks">
                <Modal
                  :key="item.id"
                  title="Add track(s) in playlist"
                  icon="add"
                  button-classes="small responsive upper transparent special-mdl-btn small-margin"
                  position="center medium"
                >
                  <div id="Add-tracks">
                    <PlaylistInviteForm path="tracks" :playlist="item" :items="tracks" />
                  </div>
                </Modal>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div v-if="controls" class="playlist-add-btn">
      <Modal
        title="Add new playlist"
        icon="add"
        position="center medium"
        button-classes="small responsive upper round grey3"
        padding="newplaylist"
      >
        <PlaylistForm
          title="Create new playlist"
          icon="add"
          :action="createPlaylist"
        />
      </Modal>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

import FileList from '../FileList.vue';
import Modal from '../Base/Modal.vue';
import PlaylistForm from '../PlaylistForm.vue';
import PlaylistInviteForm from '../PlaylistInviteForm.vue';

export default {
  el: '#Playlist',
  name: 'AudioPlayerPlaylists',
  components: {
    FileList,
    Modal,
    PlaylistForm,
    PlaylistInviteForm,
  },
  props: { controls: Boolean },
  data() {
    return {
      expandedItems: [],
      hoveredItem: null,
      copiedId: null,
    };
  },
  computed: mapState({
    tracks: (state) => state.tracks.items,
    users: (state) => state.users.items,
    playlists: (state) => state.playlists.items,
  }),
  methods: {
    ...mapActions('tracks', [
      'select', 'remove',
    ]),
    ...mapActions('playlists', ['create', 'update', 'remove']),
    ...mapMutations(['setModalVisibility']),

    async createPlaylist(item) {
      try {
        await this.create(item);
        // Close the modal after successful creation
        this.setModalVisibility();
      } catch (error) {
        // Error handling is done by the store's error handler
        throw error;
      }
    },

    toggleExpand(itemId) {
      const index = this.expandedItems.indexOf(itemId);
      if (index > -1) {
        this.expandedItems.splice(index, 1);
      } else {
        this.expandedItems.push(itemId);
      }
    },


    async copyShareLink(playlistId) {
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/playlist/${playlistId}`;

      try {
        await navigator.clipboard.writeText(shareUrl);
        this.copiedId = playlistId;

        // Reset the checkmark after 2 seconds
        setTimeout(() => {
          this.copiedId = null;
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          this.copiedId = playlistId;
          setTimeout(() => {
            this.copiedId = null;
          }, 2000);
        } catch (error) {
          console.error('Failed to copy link:', error);
        }
        document.body.removeChild(textArea);
      }
    },
  },
  created() {
    this.$store.dispatch('playlists/getAll');
    this.$store.dispatch('tracks/getAll');

    // Only fetch users if the current user is an admin (needed for invite form)
    if (this.$store.getters['auth/userId']) {
      this.$store.dispatch('users/getAll');
    }
  },
  updated() {
    this.$store.dispatch('playlists/update');
  },
};
</script>

<style lang="scss" scoped>
  #Playlist {
    max-height: calc(90vh - var(--height) - 50px - 12em);
  }

  .flex-item {
    &::-webkit-scrollbar-track {
      border-radius: 0;
      background-color: var(--secondary-color);
    }

    &::-webkit-scrollbar {
      width: 5rem;
      border-radius: 0;
      background-color: var(--secondary-color);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 0;
      background-color: var(--primary-color);
    }
  }

  .file-explorer {
    width: 100%;
    background-color: var(--secondary-dark-color);
    border: 1px solid var(--additional-dark-color);
  }

  .file-explorer-header {
    display: flex;
    padding: 12px 16px;
    background-color: var(--primary-dark-color);
    border-bottom: 1px solid var(--additional-dark-color);
    font-weight: 600;
    font-size: 14px;
    color: var(--secondary-highlight-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .file-explorer-col {
    display: flex;
    align-items: center;
    
    &.name-col {
      flex: 1;
      min-width: 0;
      width: 100%;
    }
  }

  .file-explorer-body {
    display: flex;
    flex-direction: column;
  }

  .file-explorer-item {
    border-bottom: 1px solid var(--additional-dark-color);
    
    &:nth-child(even) {
      background-color: rgba(0, 0, 0, 0.1);
    }
    
    &.hovered {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  .file-explorer-row {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    min-height: 40px;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  .file-item-content {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    width: 100%;
  }

  .file-caret {
    display: flex;
    align-items: center;
    width: 20px;
    flex-shrink: 0;
    
    i {
      font-size: 18px;
      color: var(--secondary-highlight-color);
      transition: transform 0.2s ease;
    }
  }

  .file-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    
    i {
      font-size: 20px;
      color: white;
    }
  }

  .file-name {
    color: var(--secondary-highlight-color);
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
    text-align: left;
  }

  .file-count {
    color: var(--primary-accent-color);
    font-size: 12px;
    margin-left: 4px;
    flex-shrink: 0;
  }


  .file-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s ease;
    margin-left: auto;
    flex-shrink: 0;
  }

  .file-explorer-item:hover .file-actions {
    opacity: 1;
  }

  .file-action-btn {
    background: transparent;
    border: none;
    padding: 4px 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    i {
      font-size: 16px;
      color: var(--primary-highlight-color);
    }
    
    &:hover i {
      color: var(--secondary-highlight-color);
    }
  }

  .file-explorer-children {
    background-color: rgba(0, 0, 0, 0.2);
    padding-left: 24px;
    border-top: 1px solid var(--additional-dark-color);
  }

  .file-explorer-tracks {
    padding: 8px 0;
  }

  .file-explorer-add-tracks {
    padding: 8px 0 12px 0;
  }

  .playlist-filelist {
    padding: 0;
  }

  .playlist-add-btn {
    height: auto;
    padding: 12px 16px;
    background-color: var(--secondary-dark-color);
    border-top: 1px solid var(--additional-dark-color);
  }

  // Transition animations
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .slide-down-enter,
  .slide-down-leave-to {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
  }

  .slide-down-enter-to,
  .slide-down-leave {
    max-height: 1000px;
    opacity: 1;
  }

  @media screen and (orientation: portrait) {
    #Playlist {
      max-height: calc(90vh - var(--height) - 50px - 10em + 6rem);
    }


    .file-actions {
      opacity: 1;
    }
  }
</style>
