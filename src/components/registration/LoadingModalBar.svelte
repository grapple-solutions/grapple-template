<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import X from '../../assets/icons/x.svg.svelte';

  export let loadingState = {
    isLoading: false,
    completed: false,
    error: false,
    retry: false,
    functionAfterError: function() {
      this.isLoading = false;
    },
    functionAfterCompleted: function() {
      this.isLoading = false;
    }
  };

  let seconds = 40;
  let currentMessage = 0;
  let errorMessage = false;
  let messages = [
    "",
    "Die Datei wird hochgeladen.",
    "Die Datei wird geprüft und konvertiert.",
    "Texte werden ausgelesen.",
    "Die Resultate werden aufbereitet.",
    "Prozess wird abgeschlossen."
  ];
  let loadingBar;

  const showMessages = () => {
    let interval = seconds / messages.length;
      
    for(let k = 0; k < messages.length - 2; k++) {
      setTimeout(() => {
        currentMessage = k + 1;
      }, (k * interval) * 1000);
    }
  }

  const closeModal = () => {
    loadingState = {
      ...loadingState,
      isLoading: false,
      error: false,
      retry: false,
    }
  }

  onMount(() => {
    loadingBar = document.querySelector("#loading-bar");
    loadingBar.style.transition = "width " + seconds + "s";
    loadingBar.style.width = '100%';
    showMessages();
  })

  $: if(loadingState.completed) {
    currentMessage = messages.length - 1;
    setTimeout(() => {
      loadingState.functionAfterCompleted();
    }, 300);
  }

  $: if(loadingState.retry) {
    loadingBar = document.querySelector("#loading-bar");
    loadingBar.style.transition = "width " + 0 + "s";
    loadingBar.style.width = '0px';
    setTimeout(() => {
      loadingBar.style.transition = "width " + seconds + "s";
      loadingBar.style.width = '100%';
    }, 1)
    showMessages();
  }

  $: if(loadingState.error) {
    errorMessage = "Etwas ist schief gelaufen.";
    setTimeout(() => {
      loadingState.functionAfterError();
    }, 700);
  }
</script>

<div transition:fade class="z-[3] fixed bg-[#000a] backdrop-blur-[2px] 
  top-0 left-0 w-full h-screen flex items-center justify-center flex-col">
  <div class="flex flex-col items-center w-[90%]">
    {#if errorMessage}
      <span class="w-full text-center text-red-400 z-[1] 
        font-CorpoS-Bold text-[20px]">
        {errorMessage}
      </span>
    {:else}
    {#if loadingState.retry}
      <span class="w-[90%] text-center text-white z-[1] 
      font-CorpoS-Bold text-[16px]">(Erneut versuchen)</span>
    {/if}
      <span class="w-[90%] text-center text-white z-[1] 
        font-CorpoS-Bold text-[20px]">
        {messages[currentMessage]}
      </span>
    {/if}
    <div class="mt-8 flex items-center justify-center bg-white overflow-hidden
      border-[1px] border-[#fff] relative h-8 w-full md:w-[60%] rounded-2xl p-4">
      <div class="w-full h-8 absolute">
        {#if loadingState.completed || loadingState.error}
          <div id="completed-bar" class={`left-0 top-0 absolute 
            w-full h-8`} 
            style={loadingState.error == true ? "background-color: #F87171" : "background-color: #34D399"}></div>
        {/if}
        <div id="loading-bar" class="w-0 h-8 bg-[#176db7]"></div>
      </div>
    </div>
    <button on:click={closeModal} 
      class="flex items-center justify-center rounded-full duration-200
        w-14 h-14 border-[1px] border-white hover:bg-[#0003] mt-8 text-white">
      <X />
    </button>
  </div>
</div>