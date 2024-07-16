<script lang="ts">
  import XSvg from "../../assets/icons/x.svg.svelte";
  import {
    clearAllToasts,
    clearToast,
    toasts,
  } from "../../store/_shared/toasts";
  import { fly } from "svelte/transition";

  let timeoutDivRefs: { [key: string]: HTMLDivElement } = {};
</script>

<div
  class="fixed top-4 right-4 z-50 grid w-full max-w-sm gap-3 pl-8 sm:top-8 sm:right-8"
>
  {#each $toasts as { _id, type, name, message, timeout } (_id)}
    <div
      transition:fly|local={{ x: 64 }}
      class="relative flex transform-gpu overflow-hidden rounded border shadow-xl backdrop-blur backdrop-saturate-200 {type ===
      'info'
        ? 'border-sky-400 bg-sky-200/90 text-sky-900 shadow-sky-600/10'
        : type === 'error'
        ? 'border-red-400 bg-red-200/90 text-red-900 shadow-red-600/10'
        : ''}"
    >
      <span class="sm:text-h3 my-auto flex-1 overflow-x-auto px-4 py-3">
        {name}
        <br />
        {message}
      </span>

      <button
        class="w-max flex-shrink-0 select-none rounded px-4 py-3 text-xl text-slate-900/50 transition-all hover:text-red-600"
        type="button"
        on:click={() => clearToast(_id)}
      >
        <XSvg class="h-3 w-3" />
      </button>

      {#if timeout}
        <div
          bind:this={timeoutDivRefs[_id]}
          class="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full transform-gpu rounded-l transition-all ease-linear {type ===
          'info'
            ? 'bg-sky-300'
            : type === 'error'
            ? 'bg-red-300'
            : ''}"
          style="transition-duration: {(() => {
            setTimeout(() => {
              if (timeoutDivRefs[_id]) {
                timeoutDivRefs[_id].style.width = '0%';
              }
            }, 0);
            return timeout;
          })()}ms"
        />
      {/if}
    </div>
  {/each}
</div>
