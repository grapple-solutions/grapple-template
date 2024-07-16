<script lang="ts">
  import { _ } from "svelte-i18n";
  import { fade } from "svelte/transition";

  export let showContactUs;

  export let showThankyouMessage;
</script>

<div
  class="fixed z-50 inset-0 overflow-y-auto"
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true"
  transition:fade={{ delay: 0, duration: 200 }}
>
  <div
    class="flex justify-center items-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0"
  >
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      aria-hidden="true"
    ></div>

    <div
      class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full"
    >
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 w-full">
        <div class="sm:flex sm:items-start w-full">
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <div class="absolute top-0 right-0 pt-2 pr-2">
              <button
                type="button"
                class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                on:click={() => {
                  showContactUs = false;
                  showThankyouMessage = false;
                }}
              >
                <span class="sr-only"> Close </span>
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  /></svg
                >
              </button>
            </div>
            <div class="text-center flex gap-4 flex-col mt-5">
              <!-- success svg -->
              <svg
                class="h-20 w-20 text-green-400 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>

              <h3
                class="text-2xl leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                {$_("Thank you for your inquiry.")}
              </h3>

              <h2>
                {$_("We will get back to you shortly.")}
              </h2>

              <h2 class="text-sm">
                {$_("You can now close this window.")}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
