import { describe, expect, it } from 'vitest';
import mobilePackage from '../../package.json';

describe('mobile toolchain', () => {
  it('uses official uni-app vite scripts', () => {
    expect(mobilePackage.scripts['dev:h5']).toBe('uni');
    expect(mobilePackage.scripts['build:h5']).toBe('uni build');
  });
});
