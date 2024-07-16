<script>
  import { _ } from "svelte-i18n";

  import mbdImpressum from "../../assets/MBD-Impressum-2022-09.pdf";
  import mbdDatenschutz from "../../assets/MBD-Datenschutzhinweise_2022-09.pdf";
  import mbdRechtlicheHinweise from "../../assets/MBD-Rechtliche-Hinweise_2022-09.pdf";
  import mbdParticipation from "../../assets/MBD-Teilnahmebedingungen_2023-08.pdf";
  import ContactUs from "./contact-us.svelte";
  import ThankYouModal from "./thank-you-modal.svelte";

  let showContactUs = false;
  let showThankyouMessage = false;
</script>

{#if showContactUs && !showThankyouMessage}
  <ContactUs bind:showContactUs bind:showThankyouMessage />
{:else if showThankyouMessage}
  <ThankYouModal bind:showContactUs bind:showThankyouMessage />
{/if}

<div
  class="flex flex-row font-CorpoS text-sm justify-center sm:space-x-4 gap-4"
>
  <div class="sm:flex sm:gap-4 w-full grid grid-cols-2">
    <div class="text-center sm:text-center w-full">
      <a
        href={mbdImpressum}
        download
        class="cursor-pointer hover:text-primary-500"
        data-umami-event="Download - Impressum"
      >
        {$_("Impressum")}
      </a>
    </div>

    <div class="text-center sm:text-center w-full">
      <a
        href={mbdDatenschutz}
        download
        class="cursor-pointer hover:text-primary-500"
        data-umami-event="Download - Datenschutz"
      >
        {$_("Datenschutz")}
      </a>
    </div>

    <div class="text-center sm:text-center w-full">
      <a
        href={mbdRechtlicheHinweise}
        download
        class="cursor-pointer hover:text-primary-500"
        data-umami-event="Download - Rechtliche Hinweise"
      >
        {$_("Rechtliche Hinweise")}
      </a>
    </div>
    <div class="text-center sm:text-center w-full">
      <a
        href={mbdParticipation}
        download
        class="cursor-pointer hover:text-primary-500"
        data-umami-event="Download - Teilnahmebedingungen"
      >
        {$_("Terms and Conditions")}
      </a>
    </div>
    <div class="text-center sm:text-center w-full">
      <button
        on:click={() => (showContactUs = true)}
        class="cursor-pointer hover:text-primary-500"
        data-umami-event="Download - Teilnahmebedingungen"
      >
        {$_("Contact Us")}
      </button>
    </div>
  </div>
</div>
