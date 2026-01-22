<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <!-- Starry Background Effect -->
      <div class="stars-bg">
          <div class="stars"></div>
          <div class="stars2"></div>
          <div class="stars3"></div>
      </div>
      <div class="modal-body">
          <div class="content-wrapper">
            <h3>{{ t('migration.title') }}</h3>
            <p class="migration-text" v-html="t('migration.text')"></p>
            
            <a href="https://v2.athai.io/" class="btn-ip ip-modern text-body-3 migration-btn">
              {{ t('migration.btn') }} (v2.athai.io)
            </a>
          </div>
      </div>
      <button @click="close" class="close-button">
        <i class="icon icon-close"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { t } from '@/i18n';

export default {
  name: 'MigrationModal',
  setup(props, { emit }) {
    const close = () => {
      emit('close');
    };
    return { t, close };
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(12, 12, 14, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 400px;
  padding: 40px 30px;
  border: 1px solid var(--line);
  backdrop-filter: blur(16px);
  border-radius: 28px;
  background: var(--bg-2);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
}

.modal-body {
  position: relative;
  z-index: 2;
  width: 100%;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

h3 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #ffffff;
  font-weight: 600;
}

.migration-text {
  color: var(--text-2);
  margin-bottom: 25px;
  line-height: 1.6;
  font-size: 15px;
}

/* Button Styles matching ConnectWalletModal and HeroSection */
.btn-ip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(0deg, rgba(20, 20, 21, 0.82), rgba(20, 20, 21, 0.82)),
        linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%);
    border: 1px solid var(--line);
    box-shadow: 0px 1px 1px 0px #FFFFFF2E inset, 0px 0px 4px 0px #FFFFFF0F inset, 0px 0px 8px 0px #FFFFFF14 inset, 0px 0px 16px 0px #FFFFFF1F inset;
    padding: 7px 12px;
    border-radius: 999px;
    transition: all .3s ease;
    color: var(--text-2);
    text-decoration: none;
    cursor: pointer;
}
.btn-ip:hover {
    color: var(--primary);
    border-color: var(--primary);
}

.migration-btn {
    width: 100%;
    padding: 14px 20px;
    font-size: 16px;
    font-weight: 500;
    margin-top: 10px;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: var(--white);
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
}

/* Starry background effect */
.stars-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.stars, .stars2, .stars3 {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  background: transparent;
}
.stars {
  animation: animStar 50s linear infinite;
  box-shadow: 123px 45px #FFF, 255px 189px #FFF, 345px 8px #FFF, 99px 345px #FFF, 487px 233px #FFF, 321px 487px #FFF, 499px 10px #FFF, 23px 187px #FFF, 176px 455px #FFF, 433px 321px #FFF, 45px 23px #FFF, 231px 480px #FFF, 467px 98px #FFF, 33px 256px #FFF, 198px 321px #FFF, 349px 465px #FFF, 480px 12px #FFF, 12px 190px #FFF, 256px 432px #FFF, 490px 211px #FFF, 54px 49px #FFF, 289px 344px #FFF, 411px 189px #FFF, 76px 287px #FFF, 201px 477px #FFF, 389px 23px #FFF, 477px 376px #FFF, 156px 143px #FFF, 301px 499px #FFF, 432px 65px #FFF;
}
.stars2 {
  width: 2px;
  height: 2px;
  animation: animStar 100s linear infinite;
  box-shadow: 234px 123px #FFF, 456px 345px #FFF, 12px 487px #FFF, 498px 65px #FFF, 213px 289px #FFF, 45px 456px #FFF, 345px 98px #FFF, 187px 399px #FFF, 432px 187px #FFF, 88px 88px #FFF, 287px 465px #FFF, 478px 243px #FFF, 143px 32px #FFF, 365px 398px #FFF, 499px 488px #FFF;
}
.stars3 {
  width: 3px;
  height: 3px;
  animation: animStar 150s linear infinite;
  box-shadow: 87px 345px #FFF, 465px 87px #FFF, 234px 487px #FFF, 487px 234px #FFF, 156px 156px #FFF, 387px 432px #FFF, 432px 32px #FFF;
}
.stars:after, .stars2:after, .stars3:after {
  content: " ";
  position: absolute;
  top: 250px;
  width: inherit;
  height: inherit;
  background: transparent;
  box-shadow: inherit;
}
@keyframes animStar {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-250px);
  }
}
</style>
