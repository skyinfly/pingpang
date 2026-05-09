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
</style>
