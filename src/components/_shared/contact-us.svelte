<script lang="ts">
  import { _ } from "svelte-i18n";
  import { fade } from "svelte/transition";

  export let showContactUs;

  export let showThankyouMessage;

  let name = "";
  let email = "";
  let message = "";
  let form: HTMLFormElement;

  let submitting = false;

  const submitForm = async () => {
    try {
      form.reportValidity();
      submitting = true;
      await fetch(
        "https://gquwtyo6zi.execute-api.eu-central-1.amazonaws.com/notify-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            message,
          }),
        }
      );
      submitting = false;
    } catch (e) {
      console.log(e);
    }
    form.reset();
    showThankyouMessage = true;
  };
</script>

<div
  class="fixed z-[9999] inset-0 overflow-y-auto"
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true"
  transition:fade={{ delay: 0, duration: 200 }}
>
  <div
    class="flex justify-center items-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0"
  >
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75"
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
                class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                on:click={() => (showContactUs = false)}
                type="button"
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
            <div class="text-center flex gap-2 flex-col mt-5">
              <h3
                class="text-2xl leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                {$_("Feel free to contact us.")}
              </h3>

              <h2 class="text-gray-600">
                {$_(
                  "Sometimes things don't go as smoothly as we planned. If you are unable to complete the application process via the online portal, our service team is at your disposal."
                )}
              </h2>

              <h2 class="text-gray-600">
                {$_("You are welcome to inform us about your concerns here.")}
              </h2>
              <h2 class="text-gray-600">
                {$_("We will get back to you shortly.")}
              </h2>
            </div>

            <div class="mt-2">
              <form on:submit|preventDefault={submitForm} bind:this={form}>
                <div>
                  <label
                    for="fullname"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {$_("Full Name")} <span class="align-top">*</span>
                  </label>
                  <div class="mt-1">
                    <input
                      type="text"
                      name="fullname"
                      id="fullname"
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full border-gray-300 rounded-md p-3 bg-gray-200"
                      bind:value={name}
                      required
                    />
                  </div>
                </div>
                <div class="mt-4">
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {$_("Email")} <span class="align-top">*</span>
                  </label>
                  <div class="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-3 border-gray-300 rounded-md bg-gray-200"
                      bind:value={email}
                      required
                    />
                  </div>
                </div>
                <div class="mt-4">
                  <label
                    for="message"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {$_("Message")} <span class="align-top">*</span>
                  </label>
                  <div class="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows="3"
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-3 border-gray-300 rounded-md bg-gray-200"
                      bind:value={message}
                      required
                    ></textarea>
                  </div>
                  <div class="mt-2">
                    <p class="text-red-500">
                      * {$_("required")}
                    </p>
                  </div>
                  <div class="py-3 sm:flex">
                    <button
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 {submitting
                        ? 'opacity-50 cursor-not-allowed pointer-events-none !bg-gray-400'
                        : ''}"
                      type="submit"
                      disabled={submitting}
                    >
                      {$_("Send")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
