<template>
  <div>
    <!-- Backdrop Overlay -->
    <transition name="fade">
      <div v-if="isOpen" class="sidebar-backdrop" @click="$emit('close')"></div>
    </transition>

    <!-- Sidebar Drawer -->
    <transition name="slide-right">
      <div v-if="isOpen" class="home-right-sidebar">
        <div class="sidebar-header">
          <h5 class="font-3 text-main-2">活动</h5>
          <button class="close-btn" @click="$emit('close')">
            <i class="icon icon-close"></i>
          </button>
        </div>
        
        <div class="sidebar-content-scroll">
          <div class="blog-sidebar sidebar-content-wrap">
            <!-- Search -->
            <!-- 
            <div class="sidebar-item">
              <h5 class="sb-title font-3 text-linear">Search</h5>
              <div class="br-line has-dot"></div>
              <form class="form-search" @submit.prevent>
                <input class="style-large type-radius-2" type="text" placeholder="Search blog..." required>
                <button type="submit" class="btn_submit tf-btn text-body-3 style-2 animate-btn animate-dark">
                  <i class="icon icon-MagnifyingGlass"></i>
                </button>
              </form>
            </div>
            -->

            <!-- Category -->
            <div class="sidebar-item">
              <h5 class="sb-title font-3 text-linear">小游戏</h5>
              <div class="br-line has-dot"></div>
              <ul class="sb-category">
                <li>
                  <router-link to="/crash" class="text-body-1" @click="$emit('close')">
                    Crash
                    <i class="icon icon-ArrowUpRight"></i>
                  </router-link>
                </li>
                <!--
                <li>
                  <a href="#" class="text-body-1">
                    AI design
                    <i class="icon icon-ArrowUpRight"></i>
                  </a>
                </li>
                <li>
                  <a href="#" class="text-body-1">
                    Content write
                    <i class="icon icon-ArrowUpRight"></i>
                  </a>
                </li>
                <li>
                  <a href="#" class="text-body-1">
                    Developer
                    <i class="icon icon-ArrowUpRight"></i>
                  </a>
                </li>
                -->
              </ul>
            </div>

            <!-- Recent posts -->
            <!-- 
            <div class="sidebar-item">
              <h5 class="sb-title font-3 text-linear">Recent posts</h5>
              <div class="br-line has-dot"></div>
              <ul class="sb-recent">
                <li class="sb-recent_item hover-img">
                  <a href="#" class="recent__image img-style">
                    <img loading="lazy" width="94" height="94" src="/asset/images/blog/recent-1.jpg" alt="Recent">
                  </a>
                  <div class="recent__content">
                    <div class="entry_date">
                      <i class="icon icon-Clock"></i>
                      <span class="date text-body-3">
                        August 3, 2025
                      </span>
                    </div>
                    <a href="#" class="entry_name link">
                      Leak suggests OpenAI’s open-source AI model release is imminent
                    </a>
                  </div>
                </li>
                <li class="sb-recent_item hover-img">
                  <a href="#" class="recent__image img-style">
                    <img loading="lazy" width="94" height="94" src="/asset/images/blog/recent-2.jpg" alt="Recent">
                  </a>
                  <div class="recent__content">
                    <div class="entry_date">
                      <i class="icon icon-Clock"></i>
                      <span class="date text-body-3">
                        August 3, 2025
                      </span>
                    </div>
                    <a href="#" class="entry_name link">
                      Shah Muhammad, Sweco: How AI is building the future of our cities
                    </a>
                  </div>
                </li>
                <li class="sb-recent_item hover-img">
                  <a href="#" class="recent__image img-style">
                    <img loading="lazy" width="94" height="94" src="/asset/images/blog/recent-3.jpg" alt="Recent">
                  </a>
                  <div class="recent__content">
                    <div class="entry_date">
                      <i class="icon icon-Clock"></i>
                      <span class="date text-body-3">
                        August 3, 2025
                      </span>
                    </div>
                    <a href="#" class="entry_name link">
                      Google’s Veo 3 AI video creation tools are now widely available
                    </a>
                  </div>
                </li>
              </ul>
            </div>
            -->
            
            <!-- Tags -->
            <!--
            <div class="sidebar-item">
              <h5 class="sb-title font-3 text-linear">Tags</h5>
              <div class="br-line has-dot"></div>
              <ul class="sb-tag">
                <li><a href="#" class="text-body-3 link">ChatBot AI</a></li>
                <li><a href="#" class="text-body-3 link">Athena Protocol</a></li>
                <li><a href="#" class="text-body-3 link">Qore</a></li>
                <li><a href="#" class="text-body-3 link">Design</a></li>
                <li><a href="#" class="text-body-3 link">AI</a></li>
              </ul>
            </div>
            -->
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'HomeRightSidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close']
};
</script>

<style scoped>
.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9998;
  backdrop-filter: blur(2px);
}

.home-right-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 85%; /* Changed from 100% to allow backdrop to be seen on mobile */
  max-width: 400px;
  height: 100vh;
  background: var(--bg-main, #0b0b0b); /* Fallback dark bg */
  background-color: #121212; /* Explicit dark bg matching theme */
  z-index: 9999;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.3s;
}

.close-btn:hover {
  transform: rotate(90deg);
  color: #c0f; /* Accent color */
}

.sidebar-content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* Ensure the existing classes look good in this narrow container */
.sidebar-item {
  margin-bottom: 40px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>

