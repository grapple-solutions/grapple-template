<script>
  import Select from "svelte-select";

  export let open;
  export let inputValue;
  export let submitFunction;
  export let submitButtonText = "Confirm";
  export let closeModal = () => open = false;

  let collection = [
    {id: 0, value: 'custom', label: 'custom rejection reason'},
    {id: 1, value: 'incorrect-receipt', label: 'incorrect purchase receipt (invoice)'},
    {id: 2, value: 'not-mercedes-dealership', label: 'not bought at mercedes dealership'},
    {id: 3, value: 'incorrect-wheels', label: 'incorrect wheels (QA numbers) and amount of wheels'},
    {id: 4, value: 'not-mounted', label: 'not mounted / montage'},
    {id: 5, value: 'not-stored', label: 'not stored / einlagerung'},
  ];

  let selectedValue = collection[0];
  
  $: if(selectedValue) {
    if(selectedValue.id !== 0) {
      inputValue = selectedValue.label;
    } 
  }
</script>

{#if open}
  <section>
    <div id="myModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
            <div class="modal-header">
                <span class="close"
                    ><button on:click={closeModal}
                        ><svg
                            style="color: black"
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            class="bi bi-x"
                            viewBox="0 0 16 16">
                            <path
                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                                fill="black" />
                        </svg>
                    </button></span>
                <h3>Rejection reason</h3>
            </div>
            <div class="modal-body">
              <Select 
                items={collection} 
                bind:value={selectedValue}/>
              {#if selectedValue.id == 0}
                <input 
                  type="text" 
                  name="rejectionReason" 
                  bind:value={inputValue} 
                  placeholder="Rejection reason" 
                  class="modal-input border-[1px] border-slate-300" 
                />
              {/if}
              <button on:click={submitFunction} class="submit-btn">
                {submitButtonText}
              </button>
            </div>
        </div>
    </div>
  </section>
{/if}

<style>
  /* The Modal (background) */
  .modal {
      position: fixed; /* Stay in place */
      z-index: 9999; /* Sit on top */
      display: flex;
      justify-content: center;
      align-items: center;
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow-y: auto; /* Enable scroll if needed */
      background-color: rgb(0, 0, 0); /* Fallback color */
      background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  }
  /* Modal Content */
  .modal-content {
      position: relative;
      background-color: #fefefe;
      margin: auto;
      border: 1px solid #888;
      border-radius: 10px;
      width: 24rem;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
          0 6px 20px 0 rgba(0, 0, 0, 0.19);
      -webkit-animation-name: animatetop;
      -webkit-animation-duration: 0.4s;
      animation-name: animatetop;
      animation-duration: 0.4s;
  }
  /* Add Animation */
  @-webkit-keyframes animatetop {
      from {
          top: -300px;
          opacity: 0;
      }
      to {
          top: 0;
          opacity: 1;
      }
  }
  @keyframes animatetop {
      from {
          top: -300px;
          opacity: 0;
      }
      to {
          top: 0;
          opacity: 1;
      }
  }
  /* The Close Button */
  .close {
      color: black;
      float: right;
      font-size: 28px;
      font-weight: bold;
  }
  .close:hover,
  .close:focus {
      color: #000;
      text-decoration: none;
      cursor: pointer;
  }
  .submit-btn {
    background-color: #044c9c;
    color: white;
    border: none;
    padding: 15px;
    border-radius: 10px;
    font-size: 18px;
    width: 100%;
  }
  .modal-input {
    width: 100%;
    border-radius: 10px;
    padding: 10px;
  }
  .modal-header {
    padding: 12px;
    width: 100%;
    font-size: 22px;
    color: black;
  }
  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 7px;
    padding: 12px;
    width: 100%;
  }
</style>