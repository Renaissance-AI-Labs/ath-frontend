<template>
  <div>
    <span class="br-line"></span>
    <HeroSection @open-inject-modal="openInjectModal" />
    <!-- <FeatureSection /> -->
    <HowToUseSection />
    <!-- <BenefitSection /> -->
    <!-- <PricingSection /> -->
    <TestimonialSection />
    <!-- <FAQSection /> -->
    <!-- <CTASection /> -->

    <transition name="modal">
      <InjectPoolModal 
        v-if="isInjectModalVisible" 
        @close="closeInjectModal"
        @confirm="handleInjectionConfirm"
      />
    </transition>

    <transition name="modal">
      <ConfirmReferrerModal
        v-if="isConfirmReferrerModalVisible"
        @close="closeConfirmReferrerModal"
        @confirm="handleReferrerConfirm"
      />
    </transition>
  </div>
</template>

<script>
import HeroSection from '../components/HeroSection.vue';
// import FeatureSection from '../components/FeatureSection.vue';
// import BenefitSection from '../components/BenefitSection.vue';
import HowToUseSection from '../components/HowToUseSection.vue';
// import PricingSection from '../components/PricingSection.vue';
import TestimonialSection from '../components/TestimonialSection.vue';
import FAQSection from '../components/FAQSection.vue';
import InjectPoolModal from '../components/InjectPoolModal.vue';
import ConfirmReferrerModal from '../components/ConfirmReferrerModal.vue';
// import CTASection from '../components/CTASection.vue';

export default {
  name: 'HomeView',
  components: {
    HeroSection,
    // FeatureSection,
    // BenefitSection,
    HowToUseSection,
    // PricingSection,
    TestimonialSection,
    FAQSection,
    InjectPoolModal,
    ConfirmReferrerModal,
    // CTASection,
  },
  data() {
    return {
      isInjectModalVisible: false,
      isConfirmReferrerModalVisible: false,
      injectionData: null, // To store data from the first modal
    };
  },
  methods: {
    openInjectModal() {
      this.isInjectModalVisible = true;
    },
    closeInjectModal() {
      this.isInjectModalVisible = false;
    },
    handleInjectionConfirm(data) {
      console.log('Injection data received:', data);
      this.injectionData = data; // Store the data
      this.isInjectModalVisible = false;
      this.isConfirmReferrerModalVisible = true;
    },
    closeConfirmReferrerModal() {
      this.isConfirmReferrerModalVisible = false;
    },
    handleReferrerConfirm() {
      console.log('Referrer confirmed. Proceeding with staking using data:', this.injectionData);
      // Here you would call the final staking contract function
      this.isConfirmReferrerModalVisible = false;
    }
  }
};
</script>
