<template>
  <div>
    <GoTop />
    <div id="wrapper">
      <span class="line_page"></span>
      <div class="overlay_body"></div>
      <div class="texture_page">
          <div class="bg-texture"></div>
          <div class="temp"></div>
          <div class="bg-texture"></div>
      </div>
      <div class="hero-video" v-if="$route.path === '/'">
          <div class="video-container">
              <video class="video-width video-effect" muted autoplay loop playsinline>
                  <source src="/asset/images/video/BlackHole.mp4" type="video/mp4">
              </video>
              <div class="video-fade-overlay"></div>
          </div>
      </div>
      <Header @open-get-started-modal="openModal" />
      <router-view />
      <Footer />
    </div>
    <MobileMenu @open-get-started-modal="openModal" />
    <transition name="modal">
      <ConnectWalletModal v-if="isModalVisible" @close="closeModal" />
    </transition>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import GoTop from './components/GoTop.vue';
import MobileMenu from './components/MobileMenu.vue';
import ConnectWalletModal from './components/ConnectWalletModal.vue';
import { autoConnectWallet } from './services/wallet.js';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    GoTop,
    MobileMenu,
    ConnectWalletModal
  },
  data() {
    return {
      isModalVisible: false,
    };
  },
  methods: {
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    }
  },
  mounted() {
    autoConnectWallet();
    this.$nextTick(() => {
      const loadScript = (src, callback) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        document.body.appendChild(script);
      };
      loadScript('/asset/js/jquery.min.js', () => {
        loadScript('/asset/js/bootstrap.min.js', () => {
          loadScript('/asset/js/lazysize.min.js', () => {
            loadScript('/asset/js/infinityslide.js', () => {
              loadScript('/asset/js/gsap.min.js', () => {
                loadScript('/asset/js/wow.min.js', () => {
                  loadScript('/asset/js/ScrollTrigger.min.js', () => {
                    loadScript('/asset/js/ScrollSmooth.js', () => {
                      loadScript('/asset/js/odometer.min.js', () => {
                        loadScript('/asset/js/main.js', () => {
                          // All scripts are loaded, now we can safely assume jQuery and plugins are available.
                          // We might need to manually re-initialize plugins if they don't auto-init on load.
                          // For now, let's hope sequential loading is enough.
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
}
</script>

<style scoped>
.video-width {
  margin-left: 2px;
  width: 98%;
}

.video-container {
  position: relative;
  line-height: 0; /* Removes potential whitespace below video */
}

.video-fade-overlay {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Allows clicks to go through to video if needed */
  background: radial-gradient(ellipse 85% 65% at center, 
    rgba(12, 12, 14, 0) 25%, 
    rgba(12, 12, 14, 1) 75%);
}

.video-effect {
  filter: hue-rotate(193deg) saturate(1.13) brightness(1.0);
}
</style>
