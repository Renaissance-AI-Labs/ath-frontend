<template>
  <div>
    <span class="br-line"></span>
    <HeroSection />
    <!-- <FeatureSection /> -->
    <BenefitSection />
    <HowToUseSection />
    <!-- <PricingSection /> -->
    <!-- <TestimonialSection /> -->
    <!-- <FAQSection /> -->
    <!-- <CTASection /> -->
  </div>
</template>

<script>
import HeroSection from '../components/HeroSection.vue';
// import FeatureSection from '../components/FeatureSection.vue';
import BenefitSection from '../components/BenefitSection.vue';
import HowToUseSection from '../components/HowToUseSection.vue';
// import PricingSection from '../components/PricingSection.vue';
// import TestimonialSection from '../components/TestimonialSection.vue';
// import FAQSection from '../components/FAQSection.vue';
// import CTASection from '../components/CTASection.vue';

export default {
  name: 'HomeView',
  components: {
    HeroSection,
    // FeatureSection,
    BenefitSection,
    HowToUseSection,
    // PricingSection,
    // TestimonialSection,
    // FAQSection,
    // CTASection,
  },
};
</script>
