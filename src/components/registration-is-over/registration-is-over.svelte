<script>
  import { _ } from "svelte-i18n";
  import closedImg from "../../assets/closed.jpg";
  import Footer from "../_shared/footer.svelte";
</script>

<div
  class="flex flex-1 flex-col space-y-2 sm:space-y-4 max-h-[calc(100vh-72px-64px)]  sm:max-h-[calc(100vh-72px-64px)] max-w-screen-lg overflow-scroll   "
>
  <div class="mx-auto flex flex-col ">
    <div class="grid gap-2 ">
      <p class="title">
        {$_("The campaign period of the cashback campaign 2022 has expired.")}
      </p>
      <p class="text-sm font-semibold text-[#333] font-CorpoS-Bold">
        {$_("The registration period has expired.")}
      </p>
    </div>

    <div>
      <div
        id="content"
        class=" text-sm   max-w-screen-md md:text-justify   pr-4 text-[#767676] font-CorpoS "
      >
        <div class="flex flex-col space-y-3">
          <p>
            {$_("Ladies and Gentlemen")}
          </p>

          <p>
            {$_(
              "Thank you for your interest in the complete winter wheel cashback campaign 2022. The campaign period for this cashback campaign ended on November 30th, 2022. The application for payment of the cashback amount could be submitted until December 31, 2022. Since January 1st, 2023, no new applications can be submitted for this campaign."
            )}
          </p>

          <p>
            {$_(
              'All further information can be found in the conditions of participation for the "Winter complete wheel cashback" campaign.'
            )}
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-screen-md py-2 sm:py-4 ">
      <img class="mx-auto  object-cover" src={closedImg} alt="welcome" />
    </div>
  </div>
</div>
<div class="flex justify-end sticky bottom-0 py-2 sm:py-4 bg-white">
  <div class="pr-2 block sm:hidden">
    <Footer />
  </div>
</div>

