<script>
  // import { isTermsValidationComplete } from "../../store/stepper/steps";

  import { _ } from "svelte-i18n";
  import termSections from "./terms.json";
  import mbdTerms from "../../assets/mbd_terms.pdf";

  let terms = {};
</script>

<div class="relative">
  <div class="grid gap-3">
    <div
      class="max-h-[calc(100vh-350px)]  md:!max-h-[calc(100vh-200px)] overflow-y-auto grid gap-4 px-2 "
    >
      <div class="grid gap-6">
        {#each termSections as section, sectionIndex}
          <div>
            <div
              class="text-lg font-semibold text-[#333] mb-2 font-CorpoA-Bold"
            >
              {section.sectionName}
            </div>

            <!-- <ul
              class="grid gap-4 {terms[`${sectionIndex}`]?.isExpanded
                ? ''
                : 'line-clamp-100 inline'}"
              bind:this={terms[`${sectionIndex}`]}
            >
              {#each section.terms as term, index}
                <span class="md:text-justify text-[#333] text-sm font-CorpoS">
                  {term.term}
                </span>
              {/each}
            </ul>
            <button
              class="text-primary-500 font-CorpoS text-sm"
              on:click={() => {
                if (terms[`${sectionIndex}`]?.isExpanded) {
                  terms[`${sectionIndex}`].isExpanded = false;
                } else {
                  terms[`${sectionIndex}`].isExpanded = true;
                }
              }}
              >{terms[`${sectionIndex}`]?.isExpanded
                ? $_("Read less")
                : $_("Read more")}</button
            > -->

            <ul class="grid gap-4 ">
              {#each section.terms as term, index}
                <span class="md:text-justify text-[#333] text-sm font-CorpoS">
                  {term.term}
                </span>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="flex justify-end mt-4">
    <a href={mbdTerms} download class="button font-CorpoS text-sm"
      >{$_("Download")}</a
    >
  </div>

  <!-- <div class="absolute">
  Vielen Dank für Ihre Teilnahme. Wir werden Sie per Email über den Status Ihres
  Antrags informieren.
</div> -->
</div>
