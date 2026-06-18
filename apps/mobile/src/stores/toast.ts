import { defineStore } from 'pinia';

/**
 * Hand-rolled toast queue. uni.showToast has known quirks in H5
 * (silently swallows messages longer than 7 Chinese chars when an icon
 * is set, doesn't always render under Vue 3 + Vite), so we drive our
 * own component instead and bypass uni entirely. A single global
 * <AppToast /> mounted from App.vue consumes the queue.
 */

export type ToastTone = 'info' | 'success' | 'error';
export type ToastItem = { id: number; text: string; tone: ToastTone; expiresAt: number };

let nextId = 1;
let timer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = defineStore('toast', {
  state: () => ({
    items: [] as ToastItem[],
  }),
  actions: {
    push(text: string, tone: ToastTone = 'info', durationMs?: number) {
      if (!text) return;
      const duration = durationMs ?? (tone === 'error' ? 2600 : 1800);
      const id = nextId++;
      const item: ToastItem = { id, text, tone, expiresAt: Date.now() + duration };
      this.items.push(item);
      this.scheduleSweep();
    },
    dismiss(id: number) {
      this.items = this.items.filter((item) => item.id !== id);
    },
    scheduleSweep() {
      if (timer) clearTimeout(timer);
      const next = this.items[0];
      if (!next) return;
      const wait = Math.max(50, next.expiresAt - Date.now());
      timer = setTimeout(() => {
        timer = null;
        const now = Date.now();
        this.items = this.items.filter((item) => item.expiresAt > now);
        if (this.items.length > 0) this.scheduleSweep();
      }, wait);
    },
  },
});
