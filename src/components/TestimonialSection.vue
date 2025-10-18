<template>
    <section class="section-testimonial">
        <!-- == Head Section -->
        <div class="sect-header">
            <div class="container">
                <div class="s-meta text-caption font-2">
                    <p class="s-number_order wg-counter">
                        [ <span class="text-white">03</span> / 04 ]
                    </p>
                    <p class="s-label">[ <span class="text-white hacker-text_transform">{{ t('testimonial.connectFuture') }}</span> ]</p>
                </div>
            </div>
        </div>
        <span class="br-line"></span>
        <!-- == Tagline Section -->
        <div class="sect-tagline">
            <div class="container">
                <div class="sect-tagline_inner">
                    <span class="hafl-plus pst-left_bot wow bounceInScale"></span>
                    <span class="hafl-plus pst-right_bot wow bounceInScale"></span>
                    <h6 class="s-name text-caption font-2">
                        <span class="bar-group type-left">
                            <span class="bar_center"></span>
                        </span>
                        <span class="hacker-text_transform no-delay">
                            {{ t('testimonial.yourselfShapesFuture') }}
                        </span>
                        <span class="bar-group type-right">
                            <span class="bar_center"></span>
                        </span>
                    </h6>
                </div>
            </div>
        </div>
        <span class="br-line"></span>
        <!-- == Main Section -->
        <div class="sect-main">
            <div class="s-img_item wow bounceInScale">
                <div class="globe-cont">
                    <canvas id="cobe" width="700" height="700"></canvas>
                </div>
                <img class="lazyload img-2" src="/asset/images/section/color-bg.webp"
                    data-src="/asset/images/section/color-bg.webp" alt="Image">
            </div>
            <div class="container">
                <div class="sect-title wow fadeInUp">
                    <h2 class="s-title font-3 m-0" style="color: #fff;">
                        {{ t('testimonial.futureJourneyLine1') }} <br>
                        {{ t('testimonial.futureJourneyLine2') }}
                    </h2>
                </div>

                <div class="grid-box_icon tf-grid-layout sm-col-2 md-col-2 friends-position">
                    <!-- <div class="box-icon-text wow fadeInUp">
                        <div class="icon">
                            <img src="/asset/images/section/platform.svg" alt="Icon">
                        </div>
                        <div class="content">
                            <h5 class="title s-title font-3">呼朋唤友之力</h5>
                            <p class="sub-title text-body-3">
                                $ 52739.3913 Token
                            </p>
                        </div>
                    </div>
                    <div class="box-icon-text wow fadeInUp">
                        <div class="icon">
                            <img src="/asset/images/section/ai-core.svg" alt="Icon">
                        </div>
                        <div class="content">
                            <h5 class="title s-title font-3">发送契约链接</h5>
                            <p class="sub-title text-body-3">
                                http://localhost:5173/
                            </p>
                        </div>
                    </div> -->
                </div>

                <div class="testimonial-slide-wrap">
                    <div class="overflow-hidden has-overlay_linear type-2 mx-1">
                        <div class="infiniteSlide infiniteSlide-tes">
                            <div class="wg-testimonial">
                                <div class="tes-author">
                                    
                                    <div class="author_info">
                                        <a href="#" class="text-main-2">{{ t('testimonial.genesis') }}</a>
                                        <p class="text-body-3">{{ t('testimonial.genesisEn') }}</p>
                                    </div>
                                </div>
                                <p class="text-main-2">
                                    {{ t('testimonial.genesisDesc') }}
                                </p>
                            </div>
                            <div class="wg-testimonial">
                                <div class="tes-author">
                                    
                                    <div class="author_info">
                                        <a href="#" class="text-main-2">{{ t('testimonial.expansion') }}</a>
                                        <p class="text-body-3">{{ t('testimonial.expansionEn') }}</p>
                                    </div>
                                </div>
                                <p class="text-main-2">
                                    {{ t('testimonial.expansionDesc') }}
                                </p>
                            </div>
                            <div class="wg-testimonial">
                                <div class="tes-author">
                                    
                                    <div class="author_info">
                                        <a href="#" class="text-main-2">{{ t('testimonial.handover') }}</a>
                                        <p class="text-body-3">{{ t('testimonial.handoverEn') }}</p>
                                    </div>
                                </div>
                                <p class="text-main-2">
                                    {{ t('testimonial.handoverDesc') }}
                                </p>
                            </div>
                            <div class="wg-testimonial">
                                <div class="tes-author">
                                    
                                    <div class="author_info">
                                        <a href="#" class="link name text-main-2">{{ t('testimonial.dissolution') }}</a>
                                        <p class="text-body-3">{{ t('testimonial.dissolutionEn') }}</p>
                                    </div>
                                </div>
                                <p class="tes-text">
                                    <span class="text-main-2">{{ t('testimonial.dissolutionDesc') }}</span>
                                </p>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <span class="br-line"></span>
        <!-- == Bottom Section -->
        <div class="sect-bottom">
            <div class="container">
                <div class="box-hacker has-overlay_linear mx-1">
                    <p class="hacker-text text-caption font-2 text-uppercase hackerText">
                        qW8bL2nRM4ZpYk5gJfXvCt1uHdEo93NTaVxBYmOe7rPQnKDlcUs0AjzhFiGSwLXtRpUo6NMJvqa7bT2EfyCdx9KWZhgL1nFMR3YUJ5toepXAGvqBzNcdwskLm4iT7OPuVHxayJZErm5QbgCnX1UL2D9ptYfOEK0sWhRAgJmzliNu67BXFoQYPCHtvnwMJeaZKRxdo3TfLUGqc48sbE9NYpJAgmWTVrhXxLFo517zkidC3
                    </p>
                </div>
            </div>
        </div>
        <span class="br-line"></span>
    </section>
</template>
<script>
import { t } from '@/i18n';

export default {
    name: 'TestimonialSection',
    setup() {
        return {
            t,
        };
    },
    mounted() {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = '/asset/js/globe-init.js';
        document.body.appendChild(script);
    }
}
</script>
<style scoped>
.friends-position {
    display: flex;
    flex-direction: row;
    justify-content: center;
}
</style>
