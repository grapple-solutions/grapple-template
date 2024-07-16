<script>
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-navigator";

  import Logo from "../assets/icons/logo.svg.svelte";
</script>

<div class="bg-black">
  <div
    class="text-white py-3 px-8 sm:flex sm:justify-between items-center mx-auto w-full md:max-w-7xl"
  >
    <div
      on:click={() => {
        //redirect to step 1
        navigate("/step/0");
      }}
    >
      <Logo />
    </div>

    <div class="text-center">
      <h1 class="text-2xl font-CorpoA">
        {$_("MBD Purchase Payback Registration")}
      </h1>
    </div>
  </div>
</div>
