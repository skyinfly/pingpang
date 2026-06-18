<script setup lang="ts">
// In-app user agreement. Same content gets copied into the WeChat Mini
// Program backend "服务协议" field. Update the date when the substance
// changes so users are re-prompted to accept on next launch.
const LAST_UPDATED = '2026 年 6 月 3 日';
</script>

<template>
  <view class="page">
    <view class="header">
      <text class="title">乒乓约球 · 用户协议</text>
      <text class="updated">最后更新：{{ LAST_UPDATED }}</text>
    </view>

    <view class="section">
      <text class="body">
        欢迎使用乒乓约球。本协议是你与"乒乓约球"运营方之间就你使用本服务所订立的协议。请在使用前仔细阅读。你点击"同意"或继续使用，即表示已阅读并同意全部条款。
      </text>
    </view>

    <view class="section">
      <text class="heading">一、服务内容</text>
      <text class="body">
        我们提供乒乓球友匹配、约球发起与加入、局内沟通、签到、互评等线上工具。线下打球过程中产生的费用、场地预订与人身安全由你与其他球友自行约定与承担。
      </text>
    </view>

    <view class="section">
      <text class="heading">二、账号与登录</text>
      <text class="bullet">· 你需使用真实有效的手机号或微信账号注册登录。请妥善保管账号密码、验证码与微信登录态，因泄露造成的损失由你承担。</text>
      <text class="bullet">· 我们有权对疑似冒用、恶意刷量、欺诈的账号采取限制使用、封禁等措施。</text>
      <text class="bullet">· 同一手机号或同一微信账号同一时间只能创建一个账号。</text>
    </view>

    <view class="section">
      <text class="heading">三、信用分与行为规范</text>
      <text class="bullet">· 平台为每个用户维护信用分。准时到场、按时确认、积极沟通会提升信用分；爽约、辱骂、虚假评价、骚扰会扣分甚至冻结账号。</text>
      <text class="bullet">· 禁止发布违反国家法律法规、公序良俗的信息；禁止借平台从事博彩、广告导流、传销、违法交易等行为。</text>
      <text class="bullet">· 禁止以任何形式实施性骚扰、人身攻击、歧视或威胁。我们对相关投诉一经核实将永久封禁账号。</text>
    </view>

    <view class="section">
      <text class="heading">四、约球与到场</text>
      <text class="bullet">· 球局信息（场馆、时间、人数、水平）由主理人填写，主理人对信息的真实性负责。</text>
      <text class="bullet">· 加入球局即代表你承诺按时到场。若需取消，应在开局前 3 小时通过应用内"取消"操作通知主理人与其他成员。</text>
      <text class="bullet">· 主理人确需取消时，应填写真实原因，平台会自动通知所有参与者并退回名额。</text>
      <text class="bullet">· 场地费用与饮品费用由当事人自行约定，平台不参与交易。</text>
    </view>

    <view class="section">
      <text class="heading">五、内容与版权</text>
      <text class="bullet">· 你上传的头像、封面、评价等内容，你保留所有权；同时授予平台在本服务范围内展示、缓存、转码的非独占许可。</text>
      <text class="bullet">· 平台对违反法律法规或本协议的内容，有权删除并不另行通知。</text>
    </view>

    <view class="section">
      <text class="heading">六、免责声明</text>
      <text class="body">
        本服务仅提供信息匹配工具，对线下活动产生的任何争议、人身伤害、财物损失，平台不承担直接责任，但我们承诺协助提供必要的账号信息以便司法或行政机关介入。
      </text>
    </view>

    <view class="section">
      <text class="heading">七、协议变更与终止</text>
      <text class="body">
        我们可能根据业务调整本协议，重大变更将在显著位置公示。变更后继续使用即视为接受新协议。你也可以随时通过"我的 → 设置 → 注销账号"终止本协议。
      </text>
    </view>

    <view class="section contact">
      <text class="heading">八、联系我们</text>
      <text class="body">客服邮箱：support@pingpang.app</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 32rpx;
  background: #fff9f1;
  color: #0f1c2e;
}
.header {
  display: flex;
  flex-direction: column;
  margin-bottom: 32rpx;
}
.title {
  font-size: 40rpx;
  font-weight: 700;
}
.updated {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #7a8699;
}
.section {
  display: flex;
  flex-direction: column;
  margin-bottom: 32rpx;
  padding: 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 6rpx 24rpx rgba(15, 28, 46, 0.04);
}
.heading {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}
.body {
  font-size: 26rpx;
  line-height: 1.7;
  color: #4a5670;
}
.bullet {
  font-size: 26rpx;
  line-height: 1.7;
  color: #4a5670;
  margin-bottom: 8rpx;
}
.contact .body {
  color: #ff6a3d;
}
</style>
