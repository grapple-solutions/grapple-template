<script>
  import { fade } from "svelte/transition";
  import { onDestroy, onMount } from "svelte";
  import { handleFetchRetry } from "../handleFetchRetry";
  import RejectionReasonModal from "../_shared/RejectionReasonModal.svelte";

  export let row;
  export let mountAdminView = () => null;

  let URL = `${process.env.SVELTE_APP_REMOTE_URL}/api`;

  $: {
    if (row) {
      import("App/Purchasereceipts/updateById").then((m) => {
        let module = m.default;

        new module({
          target: document.getElementById("purchaseReceipts"),
          layout: "auto",
          props: {
            dateFormat: "DD.MM.YYYY - HH:mm",
            layout: "auto",
            id: row.purchasereceipts.id,
            schema: {
              "field-properties": {
                "hidden-fields": ["id"],
                "field-order": [
                  "purchaseDate",
                  "datesIdentified",
                  "purchaseDateOverride",
                  "storage",
                  "storageIdentified",
                  "storageOverride",
                  "switch",
                  "switchIdentified",
                  "switchOverride",
                  "dealerships",
                  "dealershipIdentified",
                  "dealerOverride",
                  "partsId",
                  "partsCount",
                  "partsIdentified",
                  "partsOverrride",
                  "vehicleVersion",
                  "vehicleVin",
                  "rekognitionResponse",
                ],
                // "json-fields": [
                //   {
                //     field: "address",
                //     template: "${street}, ${zip} ${city}",
                //   },
                // ],
                "relational-fields": [
                  {
                    name: "dealerships",
                    editable: true,
                    columns: ["vfnr", "name", "plz", "ort", "strasse"],
                  },
                ],
              },
              actions: {
                edit: {
                  removable: false,
                },
              },
            },
          },
        });
      });

      import("App/Personalinformation/updateById").then((m) => {
        let module = m.default;

        new module({
          target: document.getElementById("personalInformation"),
          layout: "auto",
          props: {
            layout: "auto",
            id: row.personalinformation.id,
            copy: ["name", "address", "email"],
            schema: {
              "field-properties": {
                "hidden-fields": [
                  "id",
                  "addressVerified",
                  "addressGeolocation",
                  "phoneVerified",
                  "phone",
                ],
                "field-order": [
                  "name",
                  "address",
                  "email",
                  "iban",
                  "ibanVerified",
                ],
                "json-fields": [
                  {
                    field: "address",
                    template: "${street}, ${zip} ${city}",
                  },
                ],
              },
              actions: {
                edit: {
                  removable: false,
                },
              },
            },
          },
        });
      });

      import("App/Purchasepaybacks/updateById").then((m) => {
        let module = m.default;

        new module({
          target: document.getElementById("purchasePaybacks"),
          layout: "auto",
          props: {
            layout: "auto",
            id: row.id,
            schema: {
              "field-properties": {
                "hidden-fields": [
                  "paidDate",
                  "paidByMbdDate",
                  "personalinformationIdIdentified",
                  "personalinformationId",
                  "personalinformation",
                  "purchasereceipts",
                  "purchasereceiptsId",
                  "personalinformationOverride",
                  "questions",
                ],
                "boolean-fields": ["completed"],
                "readonly-fields": ["id", "date"],
                "field-order": [
                  "name",
                  "address",
                  "email",
                  "iban",
                  "ibanVerified",
                ],
                "dropdown-fields": [
                  {
                    name: "cashbackType",
                    default: {
                      label: "cashback-basic",
                      value: "cashback-basic",
                    },
                    options: [
                      {
                        label: "cashback-basic",
                        value: "cashback-basic",
                      },
                      {
                        label: "cashback-full",
                        value: "cashback-full",
                      },
                    ],
                  },
                  {
                    name: "status",
                    default: {
                      label: "VERIFICATION",
                      value: "VERIFICATION",
                    },
                    options: [
                      {
                        label: "INCOMPLETE",
                        value: "INCOMPLETE",
                      },
                      {
                        label: "REJECTED",
                        value: "REJECTED",
                      },
                      {
                        label: "VERIFICATION",
                        value: "VERIFICATION",
                      },
                      {
                        label: "PRE-APPROVED",
                        value: "PRE-APPROVED",
                      },
                      {
                        label: "APPROVED",
                        value: "APPROVED",
                      },
                      {
                        label: "PRE-PAYMENT",
                        value: "PRE-PAYMENT",
                      },
                      {
                        label: "PAID",
                        value: "PAID",
                      },
                    ],
                  },
                ],
              },
              actions: {
                edit: {
                  removable: false,
                },
              },
            },
          },
        });
      });
    }
  }

  let documentEl;
  let pdfUrl = null;
  let rejectionReason;
  let fullScreen = false;
  let pdfUrlLoading = false;

  let areasOpen = {
    personalInformationArea: true,
    purchaseReceiptsArea: true,
    purchasePaybacksArea: true,
  };

  let confirmationModal = {
    open: false,
    thereAreChanges: false,
  };
  let rejectionReasonModalOpen = false;

  $: {
    if (row) {
      try {
        pdfUrlLoading = true;
        console.log({ pdf: row.purchasereceipts });
        const response = JSON.parse(row.purchasereceipts.raw);
        console.log({ response });
        // filename is the last two components of the url
        let merged = response.merged.split("/");
        let fileName =
          merged[merged.length - 2] + "/" + merged[merged.length - 1];
        console.log({ filename: fileName });

        // fetch https://d18uialac4.execute-api.eu-central-1.amazonaws.com/get-presigned-url to get the pdf url
        fetch(`${URL}/get-presigned-url`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName,
          }),
        })
          .then(async (res) => {
            pdfUrlLoading = false;
            console.log({ res });
            const data = await res.json();
            pdfUrl = data.url;

            console.log({ pdfUrl });
          })
          .catch((e) => {
            pdfUrlLoading = false;
            console.log({ e });
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  const saveInformation = async () => {
    document.querySelector("#personalInformation>div>div>div>button")?.click();
    document.querySelector("#purchaseReceipts>div>div>div>button")?.click();
    document.querySelector("#purchasePaybacks>div>div>div>button")?.click();
  };

  const approvePurchasePayback = async () => {
    saveInformation();

    await handleFetchRetry(() =>
      fetch(`${URL}/purchasepaybacks/${row.id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          status: "APPROVED",
        }),
      })
    );

    closeModal();
    mountAdminView();
  };

  const updateRow = async (rowId, fields) => {
    await fetch(`${URL}/purchasepaybacks/${rowId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(fields),
    });
    
    closeModal();
    mountAdminView();
  };

  const confirmRejection = async () => {
    const event = new CustomEvent("updateRow", {
      detail: {
        rowId: row.id,
        fields: {
          status: "REJECTED",
          rejectionReason,
        },
      },
    });

    window.dispatchEvent(event);
    rejectionReasonModalOpen = false;
  };

  const openFullScreen = () => {
    fullScreen = true;
    if (documentEl.requestFullscreen) {
      documentEl.requestFullscreen();
    } else if (documentEl.mozRequestFullScreen) {
      documentEl.mozRequestFullScreen();
    } else if (documentEl.webkitRequestFullscreen) {
      documentEl.webkitRequestFullscreen();
    } else if (documentEl.msRequestFullscreen) {
      documentEl.msRequestFullscreen();
    }
  };

  const closeFullScreen = () => {
    fullScreen = false;
    if (document?.exitFullscreen) {
      document.exitFullscreen();
    } else if (document?.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document?.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document?.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const closeModal = () => {
    closeFullScreen();
    confirmationModal.thereAreChanges = false;
    confirmationModal.open = false;
    pdfUrl = null;
    row = null;
  };

  onMount(() => {
    window.addEventListener("updateRow", (e) => {
      updateRow(e.detail.rowId, e.detail.fields)
    });

    window.addEventListener("approve", (e) => {
      console.log(e.detail);
      row = e.detail;
    });
  });

  onDestroy(() => {
    window.removeEventListener("updateRow", (e) => {
      console.log(e.detail);
    });

    window.removeEventListener("approve", (e) => {
      console.log(e.detail);
    });
  });

  $: documentEl = document?.documentElement
</script>

<RejectionReasonModal
  bind:inputValue={rejectionReason}
  submitFunction={confirmRejection}
  bind:open={rejectionReasonModalOpen} />

{#if row}
  <div
    class="fixed z-50 inset-0 overflow-y-auto flex justify-center items-center"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true">
    <!-- Are you sure you want to close? (Modal) -->
    {#if confirmationModal.open}
      <div
        transition:fade={{ delay: 0, duration: 200 }}
        class="fixed z-[9999] inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        aria-modal="true"
        role="dialog">
        <div
          class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true">​</span>
          <div
            class="relative inline-block align-middle bg-white rounded-[7px] px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span class="sr-only"> Close </span>
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  class="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  class="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title">
                  Alert
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure, you want to close? You may lose unsaved
                    changes.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                on:click={closeModal}
                type="button"
                class="w-full inline-flex justify-center rounded-[7px] border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                Yes,Close
              </button>
              <button
                on:click={() => (confirmationModal.open = false)}
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-[7px] border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      aria-hidden="true" />
    <div
      class={`flex flex-1 w-full items-center justify-center min-h-screen ${
        fullScreen ? "p-0" : "pt-4 px-4"
      }`}>
      <div
        class={`w-full ${
          fullScreen
            ? "p-2 m-0 h-screen md:w-full lg:w-full"
            : "px-4 pt-5 pb-4 md:w-11/12 lg:w-9/12"
        } 
        relative inline-block align-bottom bg-white rounded-lg text-left 
        overflow-hidden shadow-xl transform transition-all duration-200`}>
        <div class="flex justify-end">
          <!-- Full screen button -->
          <div class="flex items-center gap-2">
            <button
              on:click={() => {
                if (!fullScreen) openFullScreen();
                else closeFullScreen();
              }}
              class="button text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
              {#if !fullScreen}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#9CA3AF"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M16 4l4 0l0 4" />
                  <path d="M14 10l6 -6" />
                  <path d="M8 20l-4 0l0 -4" />
                  <path d="M4 20l6 -6" />
                  <path d="M16 20l4 0l0 -4" />
                  <path d="M14 14l6 6" />
                  <path d="M8 4l-4 0l0 4" />
                  <path d="M4 4l6 6" />
                </svg>
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#9CA3AF"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 9l4 0l0 -4" />
                  <path d="M3 3l6 6" />
                  <path d="M5 15l4 0l0 4" />
                  <path d="M3 21l6 -6" />
                  <path d="M19 9l-4 0l0 -4" />
                  <path d="M15 9l6 -6" />
                  <path d="M19 15l-4 0l0 4" />
                  <path d="M15 15l6 6" />
                </svg>
              {/if}
              <style>
                button:hover > svg {
                  stroke: #111827;
                }
              </style>
            </button>
            <button
              type="button"
              class="button text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              data-modal-toggle="defaultModal"
              on:click={() => {
                if (confirmationModal.thereAreChanges)
                  confirmationModal.open = true;
                else {
                  row = null;
                  pdfUrl = null;
                  closeFullScreen();
                }
              }}>
              <svg
                aria-hidden="true"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd" /></svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
        </div>
        <div class="flex flex-row max-h-[calc(100vh-100px)] overflow-y-auto">
          <div class="w-1/2">
            <div>
              <!-- <div id="pdf" /> -->
              <!-- <Pdf
                  url={row.purchasereceipts.raw}
                  data={row.purchasereceipts.raw}
                /> -->
              {#if !pdfUrlLoading && pdfUrl}
                <div class="w-full h-screen pr-4">
                  <!-- Adobe Embed API -->
                  <!-- <div id="embeded-pdf-div"></div>
                  <script>
                    (() => {
                      let adobeDCView = new AdobeDC.View({
                        clientId: clientId, 
                        divId: "embeded-pdf-div"
                      });
                      adobeDCView.previewFile({
                        content:{ location: { url: "/mbd_terms.pdf" } },
                        metaData:{ fileName: "pdf" }
                      }, 
                      { 
                        embedMode: "FULL_WINDOW", 
                        defaultViewMode: "FIT_PAGE", 
                        showAnnotationTools: true, 
                        showDownloadPDF: true
                      });
                    })();
                  </script> -->
                  <embed
                    class="rounded-lg"
                    src={`${pdfUrl}`}
                    width="100%"
                    height="100%"
                    title="PDF" />
                </div>
              {:else if !pdfUrlLoading && !pdfUrl}
                <div class="flex justify-center items-center">
                  <div class="flex flex-col items-center">
                    <svg
                      class="w-10 h-10 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill-rule="evenodd"
                        d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                        clip-rule="evenodd" />
                      <path
                        fill-rule="evenodd"
                        d="M10 4a1 1 0 011 1v4a1 1 0 11-2 0V5a1 1 0 011-1z"
                        clip-rule="evenodd" />
                      <path
                        fill-rule="evenodd"
                        d="M10 11a1 1 0 100 2 1 1 0 000-2z"
                        clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-400 text-sm">No PDF found</span>
                  </div>
                </div>
                <!-- loading -->
              {:else if pdfUrlLoading}
                <div class="flex justify-center items-center">
                  <div class="flex flex-col items-center">
                    <svg
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4" />
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span class="text-gray-400 text-sm">Loading PDF</span>
                  </div>
                </div>
              {/if}

              <!-- <PdfViewer url={row.purchasereceipts.raw} /> -->
            </div>
          </div>

          <div
            on:keyup={() => (confirmationModal.thereAreChanges = true)}
            class="relative flex flex-col gap-4 w-1/2">
            <!-- Purchase Payback Area -->
            <div
              on:click={() =>
                (areasOpen.purchasePaybacksArea =
                  !areasOpen.purchasePaybacksArea)}
              class="border-b-[1px] border-gray-400 flex items-center justify-between p-2 hover:bg-gray-100 duration-200 cursor-pointer rounded-lg">
              <h1 class="text-[20px] text-gray-600 text-bold">
                Purchase Paybacks
              </h1>
              {#if areasOpen.purchasePaybacksArea}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-8 h-8"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#9CA3AF"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M6 9l6 6l6 -6" />
                </svg>
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-8 h-8"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#9CA3AF"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 6l6 6l-6 6" />
                </svg>
              {/if}
            </div>
            {#if !row?.id}
              <span class={`${!areasOpen.purchasePaybacksArea ? "hidden" : "px-2"}`}>
                No purchase payback
              </span>
            {/if}
              <div
                id="purchasePaybacks"
                class={`${!areasOpen.purchasePaybacksArea ? "hidden" : ""}`} />

            <!-- Personal Information Area -->
            <div
              on:click={() =>
                (areasOpen.personalInformationArea =
                  !areasOpen.personalInformationArea)}
              class="border-b-[1px] border-gray-400 flex items-center justify-between p-2 hover:bg-gray-100 duration-200 cursor-pointer rounded-lg">
              <h1 class="text-[20px] text-gray-600 text-bold">
                Personal Information
              </h1>
              {#if areasOpen.personalInformationArea}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-8 h-8"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#9CA3AF"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M6 9l6 6l6 -6" />
                </svg>
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-8 h-8"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#9CA3AF"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 6l6 6l-6 6" />
                </svg>
              {/if}
            </div>
            {#if !row?.personalinformation?.id}
              <span class={`${!areasOpen.personalInformationArea ? "hidden" : "px-2"}`}>
                No personal information
              </span>
            {/if}
              <div
                id="personalInformation"
                on:click={(e) => {
                  console.log("CLICK")
                  console.log("COPIED => ", e.clipboardData.getData())
                }}
                class={`${!areasOpen.personalInformationArea ? "hidden" : ""}`} />

            <!-- Purchase Receipts Area -->
            <div
              on:click={() =>
                (areasOpen.purchaseReceiptsArea =
                  !areasOpen.purchaseReceiptsArea)}
              class="border-b-[1px] border-gray-400 flex items-center justify-between p-2 hover:bg-gray-100 duration-200 cursor-pointer rounded-lg mb-4">
              <h1 class="text-[20px] text-gray-600 text-bold">
                Purchase Receipts
              </h1>
              {#if areasOpen.purchaseReceiptsArea}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-8 h-8"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#9CA3AF"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M6 9l6 6l6 -6" />
                </svg>
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-8 h-8"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#9CA3AF"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 6l6 6l-6 6" />
                </svg>
              {/if}
            </div>
            {#if !row?.purchasereceipts?.id}
              <span class={`${!areasOpen.purchaseReceiptsArea ? "hidden" : "px-2"}`}>
                No purchase receipts
              </span>
            {/if}
              <div
                id="purchaseReceipts"
                class={`${!areasOpen.purchaseReceiptsArea ? "hidden" : ""}`} />
          </div>
        </div>
        <div class="flex justify-end gap-4 p-2">
          <button
            class="text-center py-3 px-6 shadow-sm hover:shadow-md transition-all text-gray-600 text-sm font-semibold
              hover:text-black border border-gray-600 active:shadow-none rounded w-full sm:ml-3 sm:w-auto"
            on:click={() => {
              if (confirmationModal.thereAreChanges)
                confirmationModal.open = true;
              else {
                row = null;
                pdfUrl = null;
                closeFullScreen();
              }
            }}
            buttontype="default"
            buttontext="Delete">
            Cancel
          </button>
          <button
            class="button"
            on:click={async () => {
              rejectionReasonModalOpen = true;
            }}>Reject</button
          >
          <button
            class="button"
            on:click={async () => {
              // set verified to true to the current selected rowId
              await saveInformation();
              closeModal();
              mountAdminView();
              // force a refresh of the table
            }}>Save</button>
          <button
            class="button"
            on:click={async () => {
              // set verified and approved to true to the current selected rowId
              await approvePurchasePayback();
              // force a refresh of the table
            }}>Approve</button>
        </div>
      </div>
    </div>
  </div>
{/if}
