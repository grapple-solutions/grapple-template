<script>
  import { navigate } from "svelte-navigator";

  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import PartsDropdown from "./parts-dropdown.svelte";
  import DealerDropdown from "./dealer-dropdown.svelte";
  import { handleFetchRetry } from "../handleFetchRetry";
  import { identifyDealership } from "../registration/identifyDealership";

  let URL = `${process.env.SVELTE_APP_REMOTE_URL}/api`;

  let recognizedText = {};
  let dealerValue = "";
  let storageKind = "";
  let receipt = null;
  let dealershipInfo;
  let selectedParts;
  let invoiceDate;
  let switchValue;
  let partsCount;

  if (localStorage.getItem("recognizedText") !== null) {
    recognizedText = JSON.parse(localStorage.getItem("recognizedText"));
  }

  if (localStorage.getItem("receipt") !== null) {
    receipt = JSON.parse(localStorage.getItem("receipt"));
    console.log({ receipt });
    partsCount = receipt.partsCount;
  }

  const response = recognizedText.successful?.[0].response.body.extractedData;

  const convertToDate = (dateString) => {
    let resultDate;
    let d = dateString?.split(".");
    try {
      resultDate = dateString
        ? new Date(Date.UTC(+d[2], +d[1] - 1, +d[0]))
        : new Date();
      resultDate = resultDate.toISOString().split("T")[0];
    } catch (error) {
      resultDate = new Date().toISOString().split("T")[0];
    }
    return resultDate;
  };

  const beforeNavigate = async () => {
    let partsId = JSON.parse(receipt.partsId);
    let isOverrided = !(partsCount.toString() == receipt.partsCount);

    if (partsId?.length !== selectedParts?.length) isOverrided = true;

    for (let k = 0; k < selectedParts; k++) {
      if (!partsId?.find((p) => p == selectedParts?.[k].id)) {
        isOverrided = true;
      }
    }

    const dealershipRaw = await identifyDealership(
      response?.["dealershipInfo"].value,
      response?.["Address of Dealership"]?.value,
      typeof response?.["Name Of Dealership"]?.value == "string"
        ? response?.["Name Of Dealership"]?.value
        : response?.["Name Of Dealership"]?.value[0]
    );

    try {
      await handleFetchRetry(() =>
        fetch(
          `${URL}/purchasereceipts?${new URLSearchParams({
            where: JSON.stringify({ id: receipt.id }),
          })}`,
          {
            method: "PATCH",
            headers: {
              Accept: "application/json, text/plain",
              "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              partsCount: `${partsCount}`,
              partsId: JSON.stringify(selectedParts.map((s) => s.id)),
              partsIdentified: JSON.stringify(selectedParts.map((s) => s.key)),
              partsOverrride: +isOverrided,
              purchaseDate: new Date(invoiceDate),
              purchaseDateOverride: +(invoiceDate !== receipt.invoiceDate),
              dealershipsId: dealershipInfo.value,
              dealerOverride: +(dealershipRaw.id !== dealershipInfo.value),
              switch: switchValue,
              switchOverride:
                "" + +(switchValue !== response?.["montage"]?.value),
              storage: storageKind,
              storageOverride:
                "" + +(storageKind !== response?.["einlagerung"]?.value),
            }),
          }
        )
      );
    } catch (error) {
      console.log({ error });
    }

    localStorage.setItem(
      "receipt",
      JSON.stringify({
        ...receipt,
        partsOverride: isOverrided,
        partsCount: partsCount.toString(),
        partsId: JSON.stringify(selectedParts.map((s) => s.id)),
        partsIdentified: JSON.stringify(selectedParts.map((s) => s.key)),
        storage: storageKind,
        storageOverride:
          "" + +(storageKind !== response?.["einlagerung"]?.value),
      })
    );
  };

  onMount(async () => {
    console.log({ response });

    let datesIdentified = response?.["invoiceDate"]?.value?.replaceAll(" ", "");
    let yearIdentified = datesIdentified?.split(".")[2];

    if (yearIdentified && yearIdentified.length == 2) {
      let day = datesIdentified.split(".")[0];
      let month = datesIdentified.split(".")[1];
      datesIdentified = `${day}.${month}.20${yearIdentified}`;
    }

    if (response) {
      console.log({ response });
      dealerValue = response["Name Of Dealership"]
        ? response["Name Of Dealership"]?.value[0]
        : "";
      storageKind = response["einlagerung"]
        ? response["einlagerung"]?.value
        : "";
      switchValue = response["montage"] ? response["montage"]?.value : "";
      invoiceDate = convertToDate(datesIdentified);
      receipt.invoiceDate = invoiceDate;
    } else {
      invoiceDate = convertToDate();
      receipt.invoiceDate = invoiceDate;
    }

    console.log({ invoiceDate });
  });
</script>

<div class="h-52">
  <!-- <div class="overflow-scroll background-red-500">
    <pre>
  {JSON.stringify(recognizedText.successful[0].response.body, null, 2)}
  </pre>
  </div> -->
  <h1 class="mb-8 title">{$_("Purchase Information")}</h1>
  <!-- <div id="purchaseInformation" /> -->
  <div>
    <p class="text-sm text-[#333] font-CorpoS">
      {$_("purchase-info-intro")}
    </p>
    <br />

    <form class="grid gap-4">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>
        <div
          class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
        >
          {$_("DEALER")}
        </div>
        <!-- <DealerDropdown /> -->
        <DealerDropdown
          bind:dealershipInfo
          rawDealershipInfo={response?.["dealershipInfo"]?.value}
          dealerValue={response?.["Address of Dealership"]?.value}
          dealerName={typeof response?.["Name Of Dealership"]?.value == "string"
            ? response?.["Name Of Dealership"]?.value
            : response?.["Name Of Dealership"]?.value[0]}
        />
      </label>
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>
        <div
          class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
        >
          {$_("PARTS")}
        </div>
        <PartsDropdown bind:selectedParts selectedIds={receipt?.partsId} />
      </label>
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>
        <div
          class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
        >
          {$_("PARTS COUNT")}
        </div>

        <div>
          <input
            class="input"
            type="number"
            on:keyup={(e) => {
              if (e.target.value < 0) partsCount = 0;
              if (e.target.value > 100) partsCount = 100;
            }}
            bind:value={partsCount}
          />
        </div>
      </label>
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>
        <div
          class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
        >
          {$_("EINLAGERUNG")}
        </div>

        <div>
          <input class="input" type="text" bind:value={storageKind} />
        </div>
      </label>
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>
        <div
          class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
        >
          {$_("WECHSEL")}
        </div>

        <div>
          <input class="input" type="text" bind:value={switchValue} />
        </div>
      </label>
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>
        <div
          class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
        >
          {$_("PURCHASE DATE")}
        </div>
        <div>
          <input type="date" bind:value={invoiceDate} class="input" />
        </div>
      </label>

      <div class="flex justify-end sticky bottom-0 py-4 bg-white font-CorpoS">
        <div class="flex w-full justify-between">
          <p class="text-red-500">
            * {$_("required")}
          </p>
          <button
            class="button mt-4"
            data-umami-event="next button on purchase information clicked"
            data-umami-event-page="/step/2"
            on:click|preventDefault={async () => {
              // update the purchaseInformation
              await beforeNavigate();
              navigate("/step/3");
            }}
          >
            {$_("Next")}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
