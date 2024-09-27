<script lang="ts">
  import { onMount } from "svelte";

  import Select from "svelte-select/Select.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let selectedValue:
    | {
        value: number;
        label: string;
      }
    | {} = {};

  export let placeholder = "Trainer";

  let handleChange = () => {
    dispatch("updateTrainer", {
      selectedValue,
    });
  };

  let list: any = [];

  onMount(async function () {
    let savedTrainer = localStorage.getItem("trainer");

    if (savedTrainer) {
      selectedValue = JSON.parse(savedTrainer);
    }

    // get the list of trainers
    // set the list of trainers to the select component
    let rapports = await fetch(
      `${process.env.SVELTE_APP_REMOTE_URL}/api/trainers`
    );
    const data = await rapports.json();

    list = [
      {
        vlaue: 0,
        label: "All Trainers",
      },
      ...data.map((r: any) => ({
        value: r.id,
        label: r.name,
      })),
    ];
  });
</script>

<div class="max-w-sm themed">
  <Select
    items={list}
    bind:value={selectedValue}
    bind:placeholder
    on:select={handleChange}
  />
</div>

<style lang="postcss">
  .themed {
    --borderHoverColor: #1a5ca3;
    --borderRadius: 4px;
    --itemHoverBG: #fff1ee;
    --itemIsActiveBG: #fa7252;
  }
</style>
