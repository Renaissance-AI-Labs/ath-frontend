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
          <h3>{{ t('language.switchTitle') }}</h3>
          <p class="connect-text-1">{{ t('language.selectLanguage') }}</p>
        </div>
        <div class="language-list">
          <ul>
            <li v-for="language in languages" :key="language.code">
              <a href="#" @click.prevent="selectLanguage(language.code)">
                <span class="language-name">{{ language.name }}</span>
                <i class="icon icon-arrow-right"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <button @click="close" class="close-button">
        <i class="icon icon-close"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { availableLanguages, setLanguage, t } from '@/i18n';

export default {
  name: 'LanguageModal',
  setup(props, { emit }) {
    const close = () => {
      emit('close');
    };

    const selectLanguage = (languageCode) => {
      setLanguage(languageCode);
      close();
    };

    return {
      languages: availableLanguages,
      close,
      selectLanguage,
      t,
    };
  },
};
</script>

<style scoped>
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
  height: 100%;
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

.title_holder p {
  color: var(--text-2);
}

.connect-text-1 {
  margin-top: 40px;
}

.language-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.language-list li {
  margin-bottom: 15px;
}

.language-list a {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border: 1px solid var(--line);
  border-radius: 12px;
  text-decoration: none;
  color: var(--white);
  transition: all 0.3s ease-in-out;
  background: var(--bg-2);
}

.language-list a:hover {
  border-color: var(--primary);
  background-color: rgba(var(--primary-rgb), 0.1);
}

.language-name {
  flex: 1;
  font-size: 16px;
  text-align: center;
}

.language-list .icon-arrow-right {
  font-size: 20px;
  color: var(--text-2);
  transition: color 0.3s ease;
}

.language-list a:hover .icon-arrow-right {
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

/* Transitions */
.modal-enter-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content {
  transition: transform 0.4s 0.1s ease, opacity 0.4s 0.1s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .modal-content {
  transform: translateY(20px);
  opacity: 0;
}

.modal-leave-active {
  transition: opacity 0.3s 0.1s ease;
}

.modal-leave-active .modal-content {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .modal-content {
  transform: translateY(20px);
  opacity: 0;
}
</style>
