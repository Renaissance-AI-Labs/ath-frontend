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
          <video class="video-width" muted autoplay loop playsinline>
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
          </video>
          <div class="orther-overlay"></div>
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
</style>
