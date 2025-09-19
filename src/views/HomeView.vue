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
    // CTASection,
  },
  data() {
    return {
      isInjectModalVisible: false,
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
      console.log('Injection confirmed with:', data);
      // Here you would typically call a service to interact with a smart contract
    }
  }
};
</script>
