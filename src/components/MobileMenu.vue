<template>
    <div class="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
        <div class="canvas-header">
            <div class="logo-site">
                <img class="lazyload" src="/asset/images/logo/logo.svg" data-src="/asset/images/logo/logo.svg" alt="LOGO">
            </div>
            <div class="btn_group">
                <a href="login.html" class="tf-btn style-2">
                    Get started
                </a>
                <span class="icon-close-popup" data-bs-dismiss="offcanvas">
                    <i class="icon-close"></i>
                </span>
            </div>
        </div>
        <span class="br-line"></span>
        <div class="canvas-body">
            <ul class="nav-ul-mb gap-0" id="wrapper-menu-navigation">

            </ul>
        </div>
        <div class="canvas-footer">
            <a href="login.html" class="tf-btn w-100 animate-btn style-high">
                Login
            </a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MobileMenu'
}
</script>
<style scoped>
.nav-ul-mb li a {
    color: #9da3af !important;
}
</style>


