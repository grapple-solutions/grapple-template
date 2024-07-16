<script lang="ts">
  import { Dashboard } from "@uppy/svelte";
  import { navigate } from "svelte-navigator";

  import "@uppy/core/dist/style.css";
  import "@uppy/dashboard/dist/style.css";
  import Uppy from "@uppy/core";
  import XHRUpload from "@uppy/xhr-upload";

  import German from "@uppy/locales/lib/de_DE";
  import { _ } from "svelte-i18n";
  import Footer from "../_shared/footer.svelte";
  import { identifyDealership } from "./identifyDealership";
  import { identifyParts } from "./identifyParts";
  import { identifyVinNumber } from "./identifyVinNumber";
  import { handleFetchRetry } from "../handleFetchRetry";
  import LoadingModalBar from "./LoadingModalBar.svelte";

  let response: any;
  let failedAttempts = 0;
  let dealerShipInfo: any;
  let datesIdentified: any;
  let showRetryModal = false;
  let onCompleteResponse: any;

  let time =
    Date.now ||
    function () {
      return +new Date();
    };

  let loadingState: any = {
    isLoading: false,
    completed: false,
    error: false,
    retry: false,
    functionAfterError: function () {
      closeModal();
    },
    functionAfterCompleted: async function () {
      closeModal();
      if (
        process.env.SVELTE_APP_SKIP_PURCHASE_INFO &&
        process.env.SVELTE_APP_SKIP_PURCHASE_INFO != "false" &&
        process.env.SVELTE_APP_SKIP_PURCHASE_INFO != "0"
      ) {
        await setDefinitiveValues();
        navigate("/step/3");
      } else {
        navigate("/step/2");
      }
    },
  };

  const convertToDateTime = (dateString: string) => {
    let resultDate;
    let d = dateString?.split(".");
    try {
      resultDate = dateString
        ? new Date(Date.UTC(+d[2], +d[1] - 1, +d[0]))
        : new Date();
    } catch (error) {
      resultDate = null;
    }
    return resultDate?.toISOString();
  };

  const setDefinitiveValues = async () => {
    const id = onCompleteResponse.successful?.[0].response.body.receiptId;

    try {
      await handleFetchRetry(() =>
        fetch(`${URL}/purchasereceipts/${id}`, {
          method: "PATCH",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            dealershipsId: dealerShipInfo?.id
              ? parseInt(dealerShipInfo?.id, 10)
              : undefined,
            purchaseDate: convertToDateTime(datesIdentified),
            storage: response?.["einlagerung"]
              ? response?.["einlagerung"]?.value
              : "",
            switch: response?.["montage"] ? response?.["montage"]?.value : "",
            storageOverride: "0",
            switchOverride: "0",
          }),
        })
      );

      let receiptInformation = null;

      if (localStorage.getItem("receipt"))
        receiptInformation = JSON.parse(
          localStorage.getItem("receipt") as string
        );

      localStorage.setItem(
        "receipt",
        JSON.stringify({
          ...receiptInformation,
          storage: response?.["einlagerung"]?.value,
          storageOverride: "0",
        })
      );
    } catch (error) {
      console.log({ error });
    }
  };

  const closeModal = () => {
    loadingState = {
      ...loadingState,
      isLoading: false,
      error: false,
      retry: false,
    };
  };

  let URL = `${process.env.SVELTE_APP_REMOTE_URL}/api`;

  const uppy = new Uppy({
    id: "files",
    locale: {
      strings: {
        ...German.strings,
        dropPasteFiles:
          "Kopie oder Foto der vollständigen Rechnung hochladen oder %{browseFiles}",
        browseFiles: "hierher ziehen, suchen oder fotografieren.",
      },
    },
    restrictions: {
      allowedFileTypes: [".jpg", ".jpeg", ".png", "application/pdf"],
      maxFileSize: 20000000,
    },
  });

  uppy.use(XHRUpload, {
    endpoint: `${URL}/extractData`,
    formData: true,
    timeout: 0,
    bundle: true,
    locale: {
      strings: {
        ...German.strings,
        dropPasteFiles:
          "Kopie oder Foto der vollständigen Rechnung hochladen oder %{browseFiles}",
        browseFiles: "hierher ziehen, suchen oder fotografieren.",
      },
    },
  });
  // you can overwrite the locales for uppy
  // https://github.com/transloadit/uppy/blob/main/packages/%40uppy/locales/src/de_DE.js
  uppy.on("upload", (data) => {
    loadingState = {
      ...loadingState,
      error: false,
      completed: false,
    };
    const skipDocumentProcessing =
      process.env.SVELTE_APP_SKIP_DOCUMENT_PROCESSING === "true";
    if (!skipDocumentProcessing) loadingState.isLoading = true;
    window["umami"].track("file upload started", {
      page: "/step/1",
      timestamp: time(),
    });
  });

  uppy.on("restriction-failed", (file, error) => {
    umami.track({
      url: "/file-upload/file-validation-failed-restriction",
      title: "Uppy File File Validation Failed Due to Restriction",
    });
    window["umami"].track("error during file upload (restriction)", {
      page: "/file-upload/validation-error-restriction",
      timestamp: time(),
      d: error.toString(),
    });
  });

  uppy.on("retry-all", (d) => {
    loadingState.retry = true;
    umami.track({ url: "/file-upload/retry", title: "Uppy File Upload Retry" });
    window["umami"].track("retry on file upload", {
      page: "/file-upload/retry",
      timestamp: time(),
      d: d.toString(),
    });
  });

  uppy.on("file-added", (d) => {
    window["umami"].track("file(s) added", {
      page: "/step/1",
      timestamp: time(),
    });
  });

  uppy.on("file-removed", (d) => {
    window["umami"].track("file removed", {
      page: "/step/1",
      timestamp: time(),
    });
  });

  uppy.on("error", (d) => {
    umami.track({
      url: "/file-upload/upload-error",
      title: "Uppy File Upload Error",
    });
    window["umami"].track("error during file upload", {
      page: "/file-upload/error",
      timestamp: time(),
      d: d.toString(),
    });
  });

  uppy.on("upload-error", (file, error, response) => {
    umami.track({
      url: "/file-upload/upload-network-error",
      title: "Uppy File Upload Network Error",
    });
    window["umami"].track("error during file upload", {
      page: "/file-upload/upload-error",
      timestamp: time(),
      d: error.toString(),
    });
  });

  uppy.on("complete", async (r: any) => {
    onCompleteResponse = r;
    // update customer process status
    localStorage.setItem(
      "customerProcess",
      JSON.stringify({
        registration: false,
      })
    );
    window["umami"].track("file upload completed", {
      page: "/step/1",
      timestamp: time(),
    });

    if (r.failed.length > 0) {
      if (failedAttempts < 3) {
        failedAttempts++;

        // retry upload request
        uppy.retryAll();
      } else {
        console.log(
          "The information on your picture could not be recognised. Please click on Cancel to try upload another picture/file or click on 'next� to enter the information manually."
        );
        loadingState.error = true;
        showRetryModal = true;
      }
      console.log(r);
      // err({
      //   message: r.failed[0].response.body.error.message,
      //   name: r.failed[0].response.body.message,
      // });
    } else {
      let URL = `${process.env.SVELTE_APP_REMOTE_URL}/api`;

      try {
        // create the purchase payback and save it in the global store

        console.log(r);

        localStorage.setItem("recognizedText", JSON.stringify(r));
        response = r.successful?.[0].response.body.extractedData;
        const id = r.successful?.[0].response.body.receiptId;

        console.log({ response });

        dealerShipInfo = await identifyDealership(
          response?.["dealershipInfo"]?.value,
          response?.["Address of Dealership"]?.value,
          typeof response?.["Name Of Dealership"]?.value == "string"
            ? response?.["Name Of Dealership"]?.value
            : response?.["Name Of Dealership"]?.value[0]
        );

        // identify the parts sold in the receipt
        const partsInfo = await identifyParts(response);

        console.log({ dealerShipInfo, partsInfo });

        datesIdentified = response?.["invoiceDate"]?.value?.replaceAll(" ", "");

        let yearIdentified = datesIdentified?.split(".")[2];
        if (yearIdentified && yearIdentified.length == 2) {
          let day = datesIdentified.split(".")[0];
          let month = datesIdentified.split(".")[1];
          datesIdentified = `${day}.${month}.20${yearIdentified}`;
        }

        const receipt = {
          rekognitionResponse: JSON.stringify(
            r.successful[0].response.body.extractedData
          ),
          dealershipsId: dealerShipInfo?.id
            ? parseInt(dealerShipInfo?.id, 10)
            : undefined,
          dealershipIdentified: dealerShipInfo?.name,
          partsCount: `${partsInfo?.partsCount}`,
          partsId: JSON.stringify(partsInfo?.partsId),
          partsIdentified: JSON.stringify(partsInfo?.partsIdentified),
          storageIdentified: response?.["einlagerung"]
            ? response?.["einlagerung"]?.value
            : "",
          switchIdentified: response?.["montage"]
            ? response?.["montage"]?.value
            : "",
          vehicleVin: identifyVinNumber(response["vin"]?.value),
          vehicleVersion: response?.["vehicle"]?.value,
          datesIdentified,
          raw: JSON.stringify(r.successful?.[0].response.body.fileUrls),
        };

        await fetch(`${URL}/purchasereceipts/${id}`, {
          method: "PATCH",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify(receipt),
        });

        const receiptData = {
          id: id,
          receipt,
        };

        const payback = await handleFetchRetry(() =>
          fetch(`${URL}/purchasepaybacks`, {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain",
              "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              purchasereceiptsId: receiptData.id,
              completed: 0,
              status: "VERIFICATION",
              cashbackType: "cashback-basic",
            }),
          })
        );

        const paybackData = await payback.json();

        // save it in localstorage
        localStorage.setItem("purchasePayBack", JSON.stringify(paybackData));
        localStorage.setItem("receipt", JSON.stringify(receiptData));

        localStorage.setItem(
          "customerProcess",
          JSON.stringify({
            registration: true,
          })
        );

        console.log({ receiptData });
        console.log({ paybackData });

        loadingState.completed = true;
      } catch (e) {
        console.log(e);
        // the receipt was not created in the backend
      }
    }
  });

  let readMore = false;
  // let show_read_more = false;
  // set max height
  let max_content_height: number = 0;
  // get height of the content
  let content_height: number;
  let screen_width: number;
  $: show_read_more =
    readMore || screen_width > 640
      ? content_height > max_content_height
      : content_height >= max_content_height;

  const handleReadMore = () => {
    readMore = !readMore;
  };

  const continueWithOutRecognition = async () => {
    // first clear the local storage from the previous purchase payback
    localStorage.removeItem("recognizedText");
    localStorage.removeItem("purchasePayBack");
    localStorage.removeItem("reciept");

    // update customer process status
    localStorage.setItem(
      "customerProcess",
      JSON.stringify({
        registration: false,
      })
    );

    try {
      // create the purchase payback and save it in the global store
      const receipt = await fetch(`${URL}/purchasereceipts`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          rekognitionResponse: JSON.stringify({}),
          raw: "",
        }),
      });
      const receiptData = await receipt.json();
      const payback = await handleFetchRetry(() =>
        fetch(`${URL}/purchasepaybacks`, {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            purchasereceiptsId: receiptData.id,
            completed: 0,
            status: "VERIFICATION",
            cashbackType: "cashback-basic",
          }),
        })
      );
      const paybackData = await payback.json();

      // save it in localstorage
      localStorage.setItem("purchasePayBack", JSON.stringify(paybackData));
      localStorage.setItem("reciept", JSON.stringify(receiptData));

      console.log({ recieptData: receiptData });
      console.log({ paybackData });

      if (
        process.env.SVELTE_APP_SKIP_PURCHASE_INFO &&
        process.env.SVELTE_APP_SKIP_PURCHASE_INFO != "false" &&
        process.env.SVELTE_APP_SKIP_PURCHASE_INFO != "0"
      ) {
        await setDefinitiveValues();
        navigate("/step/3");
      } else {
        navigate("/step/2");
      }
    } catch (e) {
      console.log(e);
      // the reciept was not created in the backend
    }
  };
</script>

<svelte:window bind:innerWidth={screen_width} />
<div
  class="flex flex-1 flex-col space-y-2 sm:space-y-4 max-h-[calc(100vh-72px-128px-128px)] sm:max-h-[calc(100vh-72px-64px)]"
>
  <div class="grid gap-2">
    <p class="title">{$_("Registration")}</p>
  </div>

  <div
    bind:clientHeight={max_content_height}
    id="parent"
    class="  {readMore ? 'overflow-y-visible' : 'overflow-y-hidden'}"
    style="height: ${content_height}px"
  >
    <div
      class="text-sm max-w-screen-md md:text-justify pr-4 text-[#767676] font-CorpoS"
    >
      <div bind:clientHeight={content_height} class="flex flex-col space-y-3">
        <p>
          {$_(
            "We congratulate you on the purhase of your new genuine Mercedes-Benz complete winter wheel set and wish you a safe journey at all times."
          )}
        </p>

        <p>
          {$_(
            "By purchasing the complete winter wheel set, having your wheels changed by your Mercedes-Benz partner and storing your complete summer wheels at the same time, you have fulfilled all the requirements to secure the additional thank you of 50.00 euros."
          )}
        </p>

        <p>
          {$_(
            "Please provide the information required below, Upload your invoice, read and accept our conditions of participation and Privacy Policy and submit the content for review."
          )}
        </p>
      </div>
    </div>
  </div>
  <div>
    <div>
      {#if !readMore && show_read_more}
        <div>
          <div
            class="w-full min-h-[100px] -mt-[108px] sm:-mt-[116px] z-10 relative pointer-events-none bg-gradient-to-t from-[rgba(255,255,255,1)] to-[rgba(255,255,255,0)]"
          />
        </div>
      {/if}
    </div>

    {#if show_read_more}
      <div class="flex justify-start">
        <button
          class="text-primary-500 font-CorpoS text-sm"
          on:click={handleReadMore}
          >{readMore ? $_("Read less") : $_("Read more")}</button
        >
      </div>
    {/if}
  </div>

  <div class="relative">
    {#if loadingState.isLoading}
      <LoadingModalBar bind:loadingState />
    {/if}
    <Dashboard
      {uppy}
      props={{
        height: 200,
        inline: true,
      }}
    />
  </div>
  <div
    class="flex flex-1 flex-col space-y-2 sm:space-y-4 max-h-[calc(100vh-72px-128px-128px)] sm:max-h-[calc(100vh-72px-64px)]"
  >
    <div
      class="text-sm max-w-screen-md md:text-justify pr-4 text-[#767676] font-CorpoS"
    >
      <div bind:clientHeight={content_height} class="flex flex-col space-y-3">
        <p>
          {$_("caution:")}
          {$_("Please use the + sign to add additional files.")}
        </p>
        <p>
          {$_("caution")}
        </p>
      </div>
    </div>
  </div>
  <div class="flex w-full justify-end sticky bottom-0 py-2 sm:py-4 bg-white">
    <div class="pr-4 block sm:hidden">
      <Footer />
    </div>
  </div>

  {#if showRetryModal}
    <div
      class="fixed z-50 inset-0 overflow-y-hidden"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class=" items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center block"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />

        <!-- <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true">&#8203;</span
      > -->

        <div
          class="relative inline-block bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all my-56 align-middle sm:max-w-screen-md sm:w-full sm:p-6 font-CorpoS text-sm"
        >
          <div>
            <span>
              {$_(
                `The information on your picture could not be recognised. Please click on Cancel to try upload another picture/file or click on 'next' to enter the information manually.`
              )}
            </span>
          </div>
          <div class="flex justify-end space-x-2 p-2">
            <div>
              <button
                class="button-danger"
                data-umami-event="cancel button clicked"
                data-umami-event-page="/step/1"
                on:click={() => {
                  console.log("cancel clicked");
                  showRetryModal = false;
                }}>{$_("Cancel")}</button
              >
            </div>
            <div>
              <button
                class="button"
                data-umami-event="next w/o upload button clicked"
                data-umami-event-page="/step/1"
                on:click={() => {
                  console.log("next clicked");
                  continueWithOutRecognition();
                }}>{$_("Next")}</button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
