<script>
export default {
  onLaunch() {
    console.log('PingPang app launched');
  },
};
</script>

<style lang="scss">
@use '@/theme/tokens.scss' as *;
@use '@/uni.scss';

page {
  min-height: 100vh;
  background: $color-bg;
  color: $color-ink;
}

/*
 * Strip the grey tap overlay mobile WebViews paint on tappable elements
 * — WeChat, MIUI Browser, iOS Safari, etc. all do it by default. Setting
 * this globally (App.vue is the project-wide style host) covers normal
 * elements, uni-app's tabBar items, the custom navigation bar, and
 * anything sub-page CSS forgets to override.
 */
*,
*::before,
*::after {
  -webkit-tap-highlight-color: transparent;
}
.uni-tabbar,
.uni-tabbar__item,
.uni-tabbar__icon,
.uni-tabbar__label,
button,
view,
.button-hover,
.tabbar-item {
  -webkit-tap-highlight-color: transparent !important;
}
/* uni-app applies a built-in :active style to <button> producing the
 * pale "loading" overlay the user noticed. Forcing transparent kills it
 * without preventing genuine hover-class styling we define ourselves. */
button::after {
  border: none !important;
}
button[hover-class='none'],
.btn-no-hover {
  background: transparent;
}
</style>
