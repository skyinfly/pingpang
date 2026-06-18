/**
 * Cross-platform toast helper.
 *
 * Routes through the toast Pinia store + AppToast renderer. We do NOT
 * use uni.showToast because:
 *   - In H5 it silently drops messages longer than 7 Chinese chars
 *     when an icon is set (most of our messages are sentence-length).
 *   - Custom rendering lets us tone the bubble (error red / success
 *     green) and stack multiple errors without one clobbering the next.
 */

import { useToastStore, type ToastTone } from '../stores/toast';
import { useModalStore } from '../stores/modal';

export type { ToastTone } from '../stores/toast';

export function toast(message: string, tone: ToastTone = 'info', duration?: number) {
  if (!message) return;
  try {
    useToastStore().push(message, tone, duration);
  } catch (err) {
    // Pinia not initialised (eg. unit-test environment without setup).
    if (typeof console !== 'undefined') console.log(`[toast:${tone}] ${message}`);
  }
}

/**
 * Show a confirmation modal and resolve when the user picks. Backed by
 * the AppModal Pinia store instead of uni.showModal — H5's polyfill
 * delegates to window.confirm() which prints the site domain at the
 * top of the dialog ("www.hanzai.site says:") which looks unprofessional
 * for a real app.
 */
export function modal(options: {
  title?: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}): Promise<{ confirm: boolean }> {
  try {
    return useModalStore().open(options);
  } catch (err) {
    // Pinia not initialised (eg. unit test env): degrade to auto-confirm
    // so callers don't deadlock.
    if (typeof console !== 'undefined') console.log(`[modal] ${options.content}`);
    return Promise.resolve({ confirm: true });
  }
}
