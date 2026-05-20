export type SessionUser = {
  id: string;
  phone: string | null;
  wechatOpenId?: string | null;
  wechatUnionId?: string | null;
  nickname: string;
  city: string;
  level: string;
  avatarUrl?: string | null;
  creditScore: number;
};

export const DEV_LOGIN_CODE = '123456';

export function isDevLoginEnabled() {
  if (process.env.ALLOW_DEV_LOGIN !== undefined) {
    return process.env.ALLOW_DEV_LOGIN === 'true';
  }

  return process.env.NODE_ENV !== 'production';
}

export function buildDevUserData(phone: string) {
  return {
    phone,
    nickname: `球友${phone.slice(0, 7)}`,
    city: '上海',
    level: 'intermediate',
    creditScore: 100,
  };
}
