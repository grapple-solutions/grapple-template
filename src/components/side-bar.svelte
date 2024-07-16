<script>
  import { onMount } from "svelte";
  import { navigate, useLocation } from "svelte-navigator";

  import Checked from "../assets/icons/checked.svelte";
  import {
    isFileUploadedValidationComplete,
    isPurchaseInformationValidationComplete,
    isPersonalInformationValidationComplete,
    isQuestionsValidationComplete,
    isTermsValidationComplete,
  } from "../store/stepper/steps";
  import { _ } from "svelte-i18n";

  const location = useLocation();
  let url = new URL(window.location.href);
  let step = url.pathname.split("/")[2];

  if (!step && !url.pathname.includes("admin")) {
    navigate("/step/0");
  }

  let steps = [
    {
      title: "1) Welcome",
      description: "Welcome to the purchase process",
      active: step === "0",
      completed: step >= "0",
      link: "step=0",
    },
    {
      title: "2) Registration",
      description: "MBD Purchase Payback Registration",
      active: step === "1",
      completed: step >= "1",
      link: "step=1",
    },
    {
      title: "3) Purchase Information",
      description: "Information about the Purchase",
      active: step === "2",
      completed: step >= "2",
      link: "step=2",
    },
    {
      title: "4) Personal information",
      description: "Personal information description",
      active: step === "3",
      completed: step >= "3",
      link: "step=3",
    },
    {
      title: "5) Questions",
      description: "Questions to payback offer",
      active: step === "4",
      completed: step >= "4",
      link: "step=4",
    },
    {
      title: "6) Terms & Conditions",
      description: "Terms & Conditions and next steps",
      active: step === "5",
      completed: step >= "5",
      link: "step=5",
    },
  ];

  // if SVELTE_APP_SKIP_PURCHASE_INFO is true, then remove the step with id=2 ("3) Purchase Information")
  if (process.env.SVELTE_APP_SKIP_PURCHASE_INFO && process.env.SVELTE_APP_SKIP_PURCHASE_INFO != "false" && process.env.SVELTE_APP_SKIP_PURCHASE_INFO != "0") {
    steps.splice(2,1)
  }


  let valid = false;

  switch (step) {
    case "1":
      isFileUploadedValidationComplete.subscribe((value) => {
        valid = value;
      });
      break;
    case "2":
      isPurchaseInformationValidationComplete.subscribe((value) => {
        valid = value;
      });
      break;
    case "3":
      isPersonalInformationValidationComplete.subscribe((value) => {
        valid = value;
      });
      break;
    case "4":
      isQuestionsValidationComplete.subscribe((value) => {
        valid = value;
      });
      break;
    case "5":
      isTermsValidationComplete.subscribe((value) => {
        valid = value;
      });
      break;
  }

  const updateCurrentStep = () => {
    url = new URL(window.location.href);
    step = url.pathname.split("/")[2];
    steps = steps.map((s) => {
      const stepNr = s.link.split("=")[1];
      return {
        ...s,
        active: step == stepNr,
        completed: step >= stepNr,
      };
    });
  };

  onMount(updateCurrentStep);

  $: if ($location) updateCurrentStep();
</script>

<div>
  <nav>
    <ol class="overflow-auto flex justify-center md:!block">
      {#each steps as step, index}
        {#if step.active}
          <li
            class="relative {index !== steps.length - 1
              ? 'pr-4 '
              : ''} md:!pr-20 md:!hidden"
          >
            <!-- Current Step -->
            {#if index !== steps.length - 1}
              <div
                class="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div class="h-0.5 w-full bg-gray-200" />
              </div>
            {/if}
            <span
              class="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-primary rounded-full"
              aria-current="step"
            >
              <span
                class="h-2.5 w-2.5 bg-primary rounded-full"
                aria-hidden="true"
              />
              <span class="sr-only">Step 3</span>
            </span>
          </li>
          <li class="relative pb-10 hidden md:!block">
            {#if index !== steps.length - 1}
              <div
                class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
                aria-hidden="true"
              />
            {/if}
            <!-- Current Step -->
            <div class="relative flex items-start group">
              <span class="h-9 flex items-center" aria-hidden="true">
                <span
                  class="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-primary rounded-full"
                >
                  <span class="h-2.5 w-2.5 bg-primary rounded-full" />
                </span>
              </span>
              <span class="ml-4 min-w-0 flex flex-col">
                <span
                  class="text-xs font-semibold tracking-wide uppercase text-primary font-CorpoS-Bold"
                >
                  {$_(step.title)}</span
                >
                <span class="text-sm text-gray-500 font-CorpoS"
                  >{$_(step.description)}</span
                >
              </span>
            </div>
          </li>
        {:else if step.completed}
          <li class="relative pr-4 md:!hidden">
            <!-- Completed Step -->

            {#if index !== steps.length - 1}
              <div
                class="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div class="h-0.5 w-full bg-primary" />
              </div>
            {/if}
            <span
              class="relative w-8 h-8 flex items-center justify-center bg-primary rounded-full hover:bg-primary-900"
            >
              <svg
                class="w-5 h-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </li>
          <li class="relative pb-10 hidden md:!block">
            {#if index !== steps.length - 1}
              <div
                class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
                aria-hidden="true"
              />
            {/if}
            <!-- Complete Step -->
            <div class="relative flex items-start group">
              <span class="h-9 flex items-center">
                <span
                  class="relative w-8 h-8 flex items-center justify-center bg-primary rounded-full group-hover:bg-primary-800"
                >
                  <!-- Heroicon name: solid/check -->
                  <Checked />
                </span>
              </span>
              <span class="ml-4 min-w-0 flex flex-col">
                <span
                  class="text-xs font-semibold tracking-wide uppercase font-CorpoS-Bold"
                >
                  {$_(step.title)}</span
                >
                <span class="text-sm text-gray-500 font-CorpoS"
                  >{$_($_(step.description))}</span
                >
              </span>
            </div>
          </li>
        {:else}
          <li
            class="relative {index !== steps.length - 1
              ? 'pr-4 '
              : ''} md:!pr-20 md:!hidden"
          >
            {#if index !== steps.length - 1}
              <div
                class="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div class="h-0.5 w-full bg-gray-200" />
              </div>
            {/if}

            <span
              class="group relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400"
            >
              <span
                class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"
                aria-hidden="true"
              />
              <span class="sr-only">Step 4</span>
            </span>
          </li>
          <li class="relative pb-10 hidden md:!block">
            {#if index !== steps.length - 1}
              <div
                class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
                aria-hidden="true"
              />
            {/if}
            <!-- Upcoming Step -->
            <div class="relative flex items-start group">
              <span class="h-9 flex items-center" aria-hidden="true">
                <span
                  class="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400"
                >
                  <span
                    class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"
                  />
                </span>
              </span>
              <span class="ml-4 min-w-0 flex flex-col">
                <span
                  class="text-xs font-semibold tracking-wide uppercase text-gray-500 font-CorpoS-Bold"
                >
                  {$_(step.title)}</span
                >
                <span class="text-sm text-gray-500 font-CorpoS"
                  >{$_(step.description)}</span
                >
              </span>
            </div>
          </li>
        {/if}
      {/each}
    </ol>
  </nav>

  <!-- <div class="flex justify-around sm:justify-between mt-4 ">
    <div class="flex pb-2">
      <button
        class="{step == 1 ? 'button-disabled' : 'button'} mx-auto"
        disabled={step == 1}
        on:click={() => {
          goToStep(parseInt(step) - 1);
        }}
      >
        Prev
      </button>
    </div>
    <div class="flex pb-2">
      <button
        class="{!valid ? 'button-disabled' : 'button'} mx-auto"
        disabled={!valid}
        on:click={() => {
          if (step == steps.length) {
            // proceed to submission
            window.location.href = "/step/6";
          } else {
            goToStep(parseInt(step) + 1);
          }
        }}
      >
        {step >= steps.length ? "Finish" : "Next"}
      </button>
    </div>
  </div> -->
</div>
