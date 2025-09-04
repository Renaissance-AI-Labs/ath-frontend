<template>
    <header id="header" class="tf-header">
        <div class="container">
            <div class="row d-flex align-items-center">
                <div class="col-5 col-lg-3">
                    <div class="header-left">
                        <a href="index.html" class="logo-site">
                            <img src="/asset/images/logo/logo.svg" alt="LOGO">
                        </a>
                    </div>
                </div>
                <div class="col-6 d-none d-lg-block">
                    <nav class="box-navigation">
                        <ul class="box-nav-menu main-nav_menu">
                            <li class="menu-item">
                                <a href="index.html" class="item-link tf-btn style-transparent text-body-3 animate-btn">
                                    Home
                                </a>
                            </li>
                            <li class="menu-item">
                                <a href="javascript:void(0)" class="item-link tf-btn style-transparent text-body-3 animate-btn">
                                    Blog
                                    <i class="icon icon-arrow-caret-down fs-7"></i>
                                </a>
                                <div class="sub-menu">
                                    <ul class="sub-menu_list">
                                        <li><a href="blog.html" class="sub-menu_link">Blog List</a></li>
                                        <li><a href="blog-detail.html" class="sub-menu_link">Blog Detail</a></li>
                                    </ul>
                                </div>
                            </li>
                            <li class="menu-item">
                                <a href="javascript:void(0)" class="item-link tf-btn style-transparent text-body-3 animate-btn">
                                    Page
                                    <i class="icon icon-arrow-caret-down fs-7"></i>
                                </a>
                                <div class="sub-menu">
                                    <ul class="sub-menu_list">
                                        <li><a href="about-us.html" class="sub-menu_link">About Us</a></li>
                                        <li><a href="faq.html" class="sub-menu_link">FAQs</a></li>
                                        <li><a href="pricing.html" class="sub-menu_link">Pricing</a></li>
                                        <li><a href="use-case.html" class="sub-menu_link">Use Case</a></li>
                                        <li><a href="use-case-detail.html" class="sub-menu_link">Use Case Detail</a></li>
                                        <li><a href="404.html" class="sub-menu_link">404</a></li>
                                    </ul>
                                </div>
                            </li>
                            <li class="menu-item">
                                <a href="contact-us.html" class="item-link tf-btn style-transparent text-body-3 animate-btn">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div class="col-7 col-lg-3">
                    <div class="header-right">
                        <div class="btn_group">
                            <a href="#" class="tf-btn text-body-3 animate-btn d-none d-sm-flex">
                                Log in
                            </a>
                            <a href="#" class="tf-btn text-body-3 style-2 animate-btn animate-dark">
                                Get started
                            </a>
                            <a href="#mobileMenu" class="btn-menu_mobile d-lg-none" data-bs-toggle="offcanvas">
                                <i class="icon icon-menu"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
export default {
  name: 'Header',
}
</script>

<style scoped>
</style>
