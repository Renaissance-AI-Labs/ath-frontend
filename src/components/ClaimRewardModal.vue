<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- Starry background effect -->
      <div class="stars-bg">
        <div class="stars"></div>
        <div class="stars2"></div>
        <div class="stars3"></div>
      </div>

      <div class="modal-body-custom">
        <!-- Header -->
        <div class="title_holder">
          <h3>领取您的等级奖励</h3>
        </div>

        <!-- Body Content (Placeholder for now) -->
        <div class="reward-content">
            <div class="hexagon-container">
                <div class="hexagon-wrapper">
                    <div class="hexagon">
                        <span class="level-text level-s5">S5</span>
                    </div>
                    <button class="tf-btn text-body-3 style-2 animate-btn animate-dark btn-claim" disabled>领取</button>
                </div>
                <div class="hexagon-wrapper">
                    <div class="hexagon">
                        <span class="level-text level-s6">S6</span>
                    </div>
                    <button class="tf-btn text-body-3 style-2 animate-btn animate-dark btn-claim" disabled>领取</button>
                </div>
                <div class="hexagon-wrapper">
                    <div class="hexagon">
                        <span class="level-text level-s7">S7</span>
                    </div>
                    <button class="tf-btn text-body-3 style-2 animate-btn animate-dark btn-claim" disabled>领取</button>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="button-group-center">
            <button class="btn-ip ip-modern text-body-3 btn-confirm" @click="$emit('close')">
                关闭
            </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close']);
</script>

<style scoped>
/* Reuse styles from other modals for consistency */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: rgba(20, 20, 21, 0.75);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.modal-body-custom {
    position: relative;
    z-index: 2;
}

.title_holder {
  text-align: center;
  margin-bottom: 25px;
  color: #fff;
}

.title_holder h3 {
    font-size: 24px;
    font-weight: 600;
}

.reward-content {
    text-align: center;
    color: #ccc;
    min-height: 100px; /* Give some space for content */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    margin: 70px 0;
}

.hexagon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px; /* Space between hexagons */
}

.hexagon-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px; /* Space between hexagon and button */
}

.hexagon {
    width: 80px;
    height: 110px; /* Increased from 92.38px to make it taller */
    position: relative;
    /* Adjusted polygon points to stretch vertically */
    clip-path: polygon(50% 0%, 100% 20%, 100% 80%, 50% 100%, 0% 80%, 0% 20%);
    background-color: rgba(255, 255, 255, 0.05); /* Slight inner fill for substance */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden; /* Crucial for containing the shine effect */
}

.hexagon::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    clip-path: inherit;
    background-color: transparent;
    border: 2px solid white;
    filter: drop-shadow(0 0 5px white) drop-shadow(0 0 10px white);
    opacity: 0.8;
}

.hexagon::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%);
    transform: translateX(-150%) skewX(-30deg);
    z-index: 1;
    animation: shine-effect 4s ease-in-out infinite;
}

.hexagon:nth-child(2)::after {
    animation-delay: 0.3s;
}

.hexagon:nth-child(3)::after {
    animation-delay: 0.6s;
}

@keyframes shine-effect {
    0% {
        transform: translateX(-250%) skewX(-30deg);
    }
    100% {
        transform: translateX(250%) skewX(-30deg);
    }
}

.btn-claim {
    padding: 8px 24px;
    font-size: 14px;
    min-width: 100px;
    /* The disabled styles are now handled by the .tf-btn[disabled] selector from the global CSS */
}

.btn-claim[disabled], .tf-btn.style-2[disabled] {
    background-image: none !important;
    background-color: #21212B !important;
    opacity: 0.6 !important;
    cursor: not-allowed !important;
}

.level-text {
    font-family: 'ChillRoundF', sans-serif; /* Using a cool, rounded font */
    font-size: 28px;
    z-index: 2; /* Ensure text is above the background effects */
}

.level-s5 { /* Copper */
    color: #bba89a;
    text-shadow: 0 0 4px #bba89a, 0 0 8px #ffb366;
}

.level-s6 { /* Silver */
    color: #ccdfe6;
    text-shadow: 0 0 4px #ffffff, 0 0 8px #d7d7d7, 0 0 12px #c0c0c0;
}

.level-s7 { /* Gold */
    color: #d8d2be;
    text-shadow: 0 0 4px #f0c43c, 0 0 8px #ffd700, 0 0 12px #fff8dc;
}


.button-group-center {
    display: flex;
    justify-content: center;
}

.btn-confirm {
    min-width: 150px;
}

/* Starry background effect - Copied from InjectPoolModal */
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

@keyframes animStar {
  from { transform: translateY(0px); }
  to { transform: translateY(-500px); }
}
</style>
