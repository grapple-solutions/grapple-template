<script lang="ts">
  // @ts-ignore
  // request by Hr. Graf (MBD) - please use yellow car with wheels picture on step 0
  // import welcomePng from "../../assets/2023-mercedes-benz-cashback-welcome.png";
  import welcomePng from "../../assets/startingsoon.jpg";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-navigator";
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
  class="flex flex-1 flex-col space-y-2 sm:space-y-4 max-h-[calc(100vh-72px-128px-32px)] sm:max-h-[calc(100vh-72px-64px)]"
>
  <div class="grid gap-2">
    <p class="title">{$_("Welcome")}</p>
    <p class="text-sm font-semibold text-[#333] font-CorpoS-Bold">
      {$_("Welcome to the Mercedes-Benz cashback campaign.")}
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
      class=" text-sm max-w-screen-md md:text-justify pr-4 text-[#767676] font-CorpoS mt-4"
    >
      <div bind:clientHeight={content_height} class="flex flex-col space-y-3">
        <p>
          {$_("Ladies and Gentlemen")}
        </p>

        <p>
          {$_(
            'Mercedes-Benz Service offers you everything from a single source. Especially if As the New Year approaches we want to remind you of the importance of seasonal correct tires on your vehicle. But even more - with ours motto "everything from one source" we offer you competent advice also a variety of attractive products for you and your vehicle.'
          )}
        </p>

        <p>
          {$_(
            "With our original Mercedes-Benz complete wheels you are always optimal on the go, because these wheels are specially designed for your Mercedes-Benz type been developed. With the seasonal wheel change, we ensure that Your desired bikes are assembled with professional competence. Our offer of comfortable storage service completes the whole thing and saves you a lot of effort."
          )}
        </p>

        <p>
          {$_(
            "Are you interested? Then secure our current thank you, that we would like to express to you as part of our cashback campaign. Should you decide to buy an original Mercedes-Benz complete winter wheel set, decide to change the wheels on your authorized service partner and ours You can use the storage service for your dismantled summer wheels money back from us."
          )}
        </p>

        <p>
          {$_(
            "You will receive all further information directly in the following application process."
          )}
        </p>
      </div>
    </div>
  </div>

  <div>
    {#if !readMore && show_read_more}
      <div>
        <div
          class="w-full min-h-[100px] -mt-[108px] sm:-mt-[116px] relative pointer-events-none bg-gradient-to-t from-[rgba(255,255,255,1)] to-[rgba(255,255,255,0)]"
        />
      </div>
    {/if}

    {#if show_read_more}
      <div class="flex justify-start">
        <button
          class="text-primary-500 font-CorpoS text-sm"
          data-umami-event="readmore clicked"
          data-umami-event-page="/step/0"
          on:click={handleReadMore}
          >{readMore ? $_("Read less") : $_("Read more")}</button
        >
      </div>
    {/if}
  </div>

  <div class="max-w-screen-md py-2 sm:py-4">
    <img
      class=" mx-auto max-h-[180px] sm:max-h-[280px] object-cover"
      src={welcomePng}
      alt="welcome"
    />
  </div>

  <div
    class="flex flex-col justify-end sticky bottom-0 py-2 sm:py-4 bg-white gap-4"
  >
    <div class="w-full flex justify-end">
      <button
        class="button"
        data-umami-event="begin button clicked"
        data-umami-event-page="/step/0"
        on:click={() => {
          // redirect to step 1

          // window.location.href = "/step/1";
          navigate("/step/1");
        }}
      >
        {$_("Start")}
      </button>
    </div>
    <div class="pr-2 block sm:hidden">
      <Footer />
    </div>
  </div>
</div>
