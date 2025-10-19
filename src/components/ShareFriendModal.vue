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
        <div class="title_holder">
          <h3>分享链接给好友</h3>
        </div>
        
        <div class="share-content" style="margin-top: 30px;">
          <div class="input-wrapper">
            <input type="text" :value="referralLink" readonly class="share-link-input" />
          </div>
          <p class="share-hint">若复制失败，可长按链接复制</p>
          <a href="#" @click.prevent="copyLink" class="btn-ip ip-modern text-body-3 copy-btn" style="margin-top: 0px;">
            复制链接给好友
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
import { showToast } from '@/services/notification';
import { t } from '@/i18n';

export default {
  name: 'ShareFriendModal',
  props: {
    referralLink: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const close = () => {
      emit('close');
    };

    const copyLink = () => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = props.referralLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast(t('toast.copySuccess'));
      } catch (err) {
        console.error('无法复制链接: ', err);
        showToast(t('toast.copyFailed'));
      }
    };

    return {
      close,
      copyLink,
    };
  },
};
</script>

<style scoped>
/* Reusing styles from ConnectWalletModal for consistency */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(12, 12, 14, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 350px;
  padding: 20px;
  border: 1px solid var(--line);
  backdrop-filter: blur(16px);
  border-radius: 28px;
  background: var(--bg-2);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.modal-body {
  width: 100%;
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
  z-index: 2;
}

.title_holder {
  text-align: center;
  margin-bottom: 20px;
}

.title_holder h3 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #ffffff;
}

.share-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.share-hint {
  color: var(--text-2);
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
}

.input-wrapper {
  width: 100%;
  margin-bottom: 20px;
}

.share-link-input {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line);
  color: var(--white);
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  overflow-x: auto;
}

.share-link-input:focus {
  outline: none;
  border-color: var(--primary);
}

.copy-btn {
  width: 100%;
  text-align: center;
  padding: 12px;
}

/* Reusing button style from ConnectWalletModal */
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
}
.btn-ip:hover {
    color: var(--primary);
}

/* Starry background effect */
.stars-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  border-radius: 28px;
  overflow: hidden;
}
.modal-body {
    position: relative;
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
