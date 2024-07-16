<script lang="ts">
  import { _ } from "svelte-i18n";
  import mbdParticipation from "../../assets/MBD-Teilnahmebedingungen_2023-08.pdf";
  import startingSoon from "../../assets/startingsoon.jpg";
  import Footer from "../_shared/footer.svelte";

  let readMore = false;
  // let show_read_more = false;
  // set max height
  let max_content_height: number = 0;
  // get height of the content
  let content_height: number;

  $: show_read_more = readMore || content_height > max_content_height;

  const handleReadMore = () => {
    readMore = !readMore;
  };
</script>

<div
  class="flex flex-1 flex-col space-y-2 sm:space-y-4 max-h-[calc(100vh-72px-64px)]  sm:max-h-[calc(100vh-72px-64px)] max-w-screen-lg overflow-scroll   "
>
  <div class="mx-auto flex flex-col ">
    <div class="grid gap-2 ">
      <p class="title">
        {$_("The campaign period of the cashback campaign 2023 has not yet started.")}
      </p>
      <p class="text-sm font-semibold text-[#333] font-CorpoS-Bold">
        {$_("The registration period starts soon.")}
      </p>
    </div>

    <div
      bind:clientHeight={max_content_height}
      id="parent"
      class="  {readMore ? 'overflow-y-visible' : 'overflow-y-hidden'}"
      style="height: ${content_height}px"
      >
      <div
        id="content"
        class=" text-sm   max-w-screen-md md:text-justify   pr-4 text-[#767676] font-CorpoS "
      >
        <div bind:clientHeight={content_height} class="flex flex-col space-y-3">
          <p>
            {$_("Ladies and Gentlemen")}
          </p>

          <p>
            {$_(
              "starting on ... you can register here for the cashback action."
            )}
          </p>

          <p>
            {$_(
              'Further information can be found in the new terms.'
            )}
            <a
              href={mbdParticipation}
              download
              class="cursor-pointer hover:text-primary-500"
              >
              {$_("Terms and Conditions")}
            </a>
          
          </p>

          <p>
            {$_(
              'Thanks for your interest.'
            )}
          </p>
        </div>
      </div>
    </div>
    
    <div class="max-w-screen-md py-2 sm:py-4 ">
      <img class="mx-auto  object-cover" src={startingSoon} alt="Registration starting soon" />
    </div>
  </div>
</div>
<div class="flex justify-end sticky bottom-0 py-2 sm:py-4 bg-white">
  <div class="pr-2 block sm:hidden">
    <Footer />
  </div>
</div>

