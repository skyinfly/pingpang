import { defineStore } from 'pinia';

/**
 * Pinia-backed modal queue. Replaces uni.showModal because the H5
 * polyfill delegates to window.confirm() which shows "<domain> says:"
 * at the top of the dialog — unprofessional for a real app.
 *
 * Callers use the `modal()` helper in utils/toast.ts; the single
 * <AppModal /> component rendered per-page consumes the queue.
 */

export type ModalOptions = {
  title?: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
};

export type ModalRecord = ModalOptions & {
  id: number;
  resolve: (result: { confirm: boolean }) => void;
};

let nextId = 1;

export const useModalStore = defineStore('modal', {
  state: () => ({
    queue: [] as ModalRecord[],
  }),
  getters: {
    /** The modal currently shown (top of queue). */
    current: (state): ModalRecord | null => state.queue[0] ?? null,
  },
  actions: {
    open(options: ModalOptions): Promise<{ confirm: boolean }> {
      return new Promise((resolve) => {
        this.queue.push({ ...options, id: nextId++, resolve });
      });
    },
    settle(id: number, confirm: boolean) {
      const idx = this.queue.findIndex((m) => m.id === id);
      if (idx === -1) return;
      const record = this.queue[idx];
      this.queue.splice(idx, 1);
      record.resolve({ confirm });
    },
  },
});
