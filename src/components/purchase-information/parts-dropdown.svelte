<script lang="ts">
  import { onMount } from "svelte";
  import Select from "svelte-select";
  export let selectedIds: any;
  export let selectedParts: IItem[];

  interface IItem {
    category: string,
    label: string,
    value: string,
    key: string,
    id: number,
  }

  let URL = `${process.env.SVELTE_APP_REMOTE_URL}/api`;

  let collection: IItem[];

  onMount (async () => {
    try {
      const result = await fetch(`${URL}/parts`);
      const partsData = await result.json()
      collection = partsData.map((p: IItem) => {
        return {
          ...p,
          label: p.key,
          value: p.key
        }
      });
      selectedIds = JSON.parse(selectedIds as string);
      selectedParts = collection?.filter(c => c.id == selectedIds?.find((s: any) => s == c.id));
    } catch (error) {
      console.log({ error })
      collection = [
        // Default values
      ];
    }
  })
</script>
<div class="max-w-[34rem] min-w-[34rem]">
  <Select 
    isMulti={true}
    items={collection} 
    bind:value={selectedParts}
    on:change={(e) => console.log(e)}
  />
</div>
