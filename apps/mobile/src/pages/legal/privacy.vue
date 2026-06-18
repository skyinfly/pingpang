<script setup lang="ts">
// Static privacy policy. Source-of-truth for both the in-app legal page
// (linked from login + profile) and the copy operators paste into the
// WeChat Mini Program backend "隐私政策" field at registration time.
//
// When this file changes, update the dated "最后更新" line and re-submit
// to the mini-program console — WeChat tracks policy changes and asks
// users to re-consent if the date shifts.
const LAST_UPDATED = '2026 年 6 月 3 日';
</script>

<template>
  <view class="page">
    <view class="header">
      <text class="title">乒乓约球 · 隐私政策</text>
      <text class="updated">最后更新：{{ LAST_UPDATED }}</text>
    </view>

    <view class="section">
      <text class="intro">
        本政策说明乒乓约球（以下简称"我们"）如何在你使用我们提供的小程序与网页服务时收集、使用、共享与保护你的个人信息。请你在使用我们的服务前仔细阅读，特别关注加粗内容。继续使用即表示你已阅读并同意本政策。
      </text>
    </view>

    <view class="section">
      <text class="heading">一、我们收集的信息</text>
      <text class="body">
        为了帮助你完成约球、与球友沟通并保障双方安全，我们会在以下场景收集对应的信息：
      </text>
      <text class="bullet">1. 账号与身份：手机号（通过短信验证码或微信"手机号快速验证"获取）、微信 openid/unionid（仅微信小程序登录场景）、你主动填写的昵称、头像、城市、技术水平。</text>
      <text class="bullet">2. 地理位置：你授权后，我们使用你的精确位置推荐附近球局、计算到场馆的距离、显示场馆在地图上的位置。位置仅在你浏览相关页面时使用，关闭页面或撤回授权后不再获取。</text>
      <text class="bullet">3. 设备与日志：访问时间、IP、设备型号、操作系统、错误日志，用于排查问题与防御异常请求。</text>
      <text class="bullet">4. 你主动上传的内容：头像图片、球局封面图片、聊天文本、对球友的评价与标签。</text>
      <text class="bullet">5. 相机/相册：当你点击"上传头像"或"上传封面"时，会请求一次性的相册或相机权限；我们不会在你未主动操作时调用这些能力。</text>
    </view>

    <view class="section">
      <text class="heading">二、我们如何使用这些信息</text>
      <text class="bullet">· 提供约球匹配、距离排序、球局推荐、聊天与到场签到等核心功能。</text>
      <text class="bullet">· 维护信用分体系、识别恶意账号、处理用户举报。</text>
      <text class="bullet">· 在你授权的范围内发送系统通知、申请审批结果、球局变更提醒。</text>
      <text class="bullet">· 改善产品体验、做匿名化的数据统计与故障排查。</text>
    </view>

    <view class="section">
      <text class="heading">三、我们如何对外共享与委托处理</text>
      <text class="body">
        我们不会出售你的个人信息。下列情形可能会发生有限范围的共享或委托处理：
      </text>
      <text class="bullet">· 短信服务商：仅传递手机号与验证码内容，用于发送登录短信。</text>
      <text class="bullet">· 微信小程序平台（Tencent）：用于完成登录态校验、消息推送、地图与位置服务（位置接口由腾讯位置服务提供）。</text>
      <text class="bullet">· 云服务商（腾讯云）：提供计算与存储基础设施；存储数据均位于中国大陆境内。</text>
      <text class="bullet">· 法律法规要求：当主管机关依法要求时，我们会在核实身份后配合提供必要信息。</text>
    </view>

    <view class="section">
      <text class="heading">四、你的权利</text>
      <text class="bullet">· 访问与更正：在"我的 → 编辑资料"中查看并修改你的昵称、头像、城市、技术水平。</text>
      <text class="bullet">· 撤回授权：可随时在系统设置中关闭位置、相册、相机、通知等授权。</text>
      <text class="bullet">· 注销账号：通过"我的 → 设置 → 注销账号"申请注销。注销后我们将在 15 个工作日内删除或匿名化你的个人信息，法律法规要求保留的除外。</text>
      <text class="bullet">· 申诉与投诉：你可以联系下文的客服邮箱。</text>
    </view>

    <view class="section">
      <text class="heading">五、未成年人保护</text>
      <text class="body">
        本服务面向年满 14 周岁的用户。如果你是未成年人，请在监护人陪同下阅读本政策并使用我们的服务。我们不会主动收集未成年人的额外信息。
      </text>
    </view>

    <view class="section">
      <text class="heading">六、信息安全</text>
      <text class="body">
        我们采用 HTTPS 传输、JWT 鉴权、敏感字段加密存储、登录态可吊销、限流与日志审计等措施保护你的信息。在发生重大安全事件时，我们会以站内信、推送或公告方式告知你。
      </text>
    </view>

    <view class="section">
      <text class="heading">七、政策的更新</text>
      <text class="body">
        本政策可能根据法律法规或产品功能变化进行更新。重大变更我们会通过显著位置告知，并视情况要求你重新确认。
      </text>
    </view>

    <view class="section contact">
      <text class="heading">八、联系我们</text>
      <text class="body">
        如对本政策有任何疑问，请联系：support@pingpang.app（运营时间内 1 个工作日内回复）。
      </text>
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
