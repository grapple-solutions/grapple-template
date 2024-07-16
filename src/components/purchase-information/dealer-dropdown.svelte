<script lang="ts">
  import Select from "svelte-select";
  import { identifyDealership } from "../registration/identifyDealership";

  let backEndUrl = `${process.env.SVELTE_APP_REMOTE_URL}/api`;

  export let dealerName = "";
  export let dealerValue = "";
  export let dealershipInfo: any;
  export let rawDealershipInfo = "";

  let allDealers: { value: number, label: string }[] = [];

  fetch(`${backEndUrl}/dealerships`).then((response) => {
    response.json().then((dealerships) => {
      allDealers = dealerships.map((dealer: any) => {
        return {
          value: dealer.id,
          label: `${dealer.id} | ${dealer.name} | ${dealer.ort}| ${dealer.strasse} | ${dealer.plz}`,
        };
      });
    });
  });

  identifyDealership(rawDealershipInfo, dealerValue, dealerName).then((response) => {
    if (response) {
      dealershipInfo = {
        value: response.id,
        label: `${response.id} | ${response.name} | ${response.ort}| ${response.strasse} | ${response.plz}`,
      };
    }
  });
</script>

{#if allDealers.length > 0}
  <div>
    <Select items={allDealers} bind:value={dealershipInfo} />
  </div>
{/if}
