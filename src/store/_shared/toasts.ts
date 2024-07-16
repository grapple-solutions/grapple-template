import { writable } from "svelte/store";

//
// GLOBAL STORES
//

type ToastType = {
  _id: string;
  type: "info" | "error";
  message: string;
  name?: string;
  timeout?: number | null;
};

export const toasts = writable<ToastType[]>([]);

let timeouts: { [_id: string]: NodeJS.Timeout } = {};

//
// TYPES
//

//
// METHODS
//

export async function clearAllToasts() {
  for (const _id in timeouts) {
    clearTimeout(timeouts[_id]);
  }
  timeouts = {};

  toasts.set([]);
}

export async function clearToast(_id: string) {
  clearTimeout(timeouts[_id]);
  delete timeouts[_id];

  toasts.update((ts) => ts.filter((err) => err._id !== _id));
}

export async function toast(
  message: ToastType["message"],
  name: ToastType["name"] = "",
  type: ToastType["type"] = "info",
  forceDuplicate = false,
  timeout?: number | null
) {
  if (timeout === undefined) {
    timeout = type === "info" ? 5000 : type === "error" ? 30000 : null;
  }

  toasts.update((ts) => {
    const duplicateIndex = ts
      .map((t) => `${t.type}${t.message}`)
      .findIndex((s) => s === `${type}${message}`);
    const isDuplicate = duplicateIndex !== -1;

    if (!isDuplicate || (isDuplicate && forceDuplicate)) {
      const _id = Math.random().toString();
      if (timeout) {
        timeouts[_id] = setTimeout(() => clearToast(_id), timeout);
      }
      return [...ts, { _id, type, name, message, timeout }];
    } else if (timeout && isDuplicate && !forceDuplicate) {
      clearTimeout(timeouts[ts[duplicateIndex]._id]);
      timeouts[ts[duplicateIndex]._id] = setTimeout(
        () => clearToast(ts[duplicateIndex]._id),
        timeout
      );
      ts[duplicateIndex].timeout = timeout;
      return [...ts];
    } else {
      return ts;
    }
  });
}

export async function err(
  e?: Error,
  forceDuplicate = false,
  timeout?: number | null
) {
  console.error(e);

  return toast(
    e?.message ?? "Unknown error",
    e?.name ?? "Error",
    "error",
    forceDuplicate,
    timeout
  );
}
