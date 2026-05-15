import { Module, OnModuleInit } from '@nestjs/common';
import { WechatClient } from './wechat-client';

@Module({
  providers: [WechatClient],
  exports: [WechatClient],
})
export class WechatModule implements OnModuleInit {
  constructor(private readonly wechat: WechatClient) {}

  onModuleInit() {
    this.wechat.enforceProduction();
  }
}
