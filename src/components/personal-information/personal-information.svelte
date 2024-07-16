<script lang="ts">
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-navigator";
  import Footer from "../_shared/footer.svelte";
  import { handleFetchRetry } from "../handleFetchRetry";

  let recognizedText: any = {};

  if (localStorage.getItem("recognizedText") !== null) {
    recognizedText = JSON.parse(
      localStorage.getItem("recognizedText") as string
    );
  }
  const response = recognizedText.successful?.[0].response.body.extractedData;

  let purchasePaybackId: string;

  // read from localstorage
  if (localStorage.getItem("purchasePayBack") !== null) {
    purchasePaybackId = JSON.parse(
      localStorage.getItem("purchasePayBack") as string
    ).id;
  }

  console.log({ response });

  const customerInformation = Object.values(
    response?.purchaseInformation?.customerInformation || {}
  );

  console.log({ response });

  console.log({
    Name: response?.["Name of Buyer"]?.value[0],
    Address: response?.["Address of buyer"]?.value,
  });

  let formValues = {
    nameValue: response?.["Name of Buyer"]?.value[0],
    companyValue: "",

    streetValue: response?.["Address of buyer"]
      ? response?.["Address of buyer"]?.value
          .replaceAll(`${response?.["Name of Buyer"]?.value[0]}, `, "")
          ?.split(",")[0]
      : "",
    cityValue: response?.["Address of buyer"]
      ? response?.["Address of buyer"].value
          .replaceAll(`${response?.["Name of Buyer"]?.value[0]}, `, "")
          ?.split(",")[1]
          ?.split(" ")[2]
      : "",
    zipValue: response?.["Address of buyer"]
      ? response?.["Address of buyer"].value
          .replaceAll(`${response?.["Name of Buyer"]?.value[0]}, `, "")
          ?.split(",")[1]
          ?.split(" ")[1]
      : "",

    email: "",
    iban: "",
  };

  let form: HTMLFormElement;
  let ibanInput: HTMLInputElement;
  let bankDetails: {
    bankCode: string;
    name: string;
    bic: string;
  } | null = null;

  const checkIban = async () => {
    if (
      formValues.iban.replaceAll(" ", "").length === 21 ||
      formValues.iban.replaceAll(" ", "").length === 22
    ) {
      const iban = formValues.iban;

      // check if the iban is only from CH, AT, FR, LU, BE, NL
      const countryCode = iban.substring(0, 2);
      console.log({ countryCode });
      if (
        !["DE", "CH", "AT", "FR", "LU", "BE", "NL"].includes(
          countryCode.toUpperCase()
        )
      ) {
        ibanInput.setCustomValidity(
          $_(
            "This IBAN number does not meet the requirements of our terms and conditions. An account in the Federal Republic of Germany must be specified. Please provide a correct IBAN number."
          )
        );
        form.reportValidity();
        return;
      }

      const response = await fetch(
        `https://openiban.com/validate/${iban}?getBIC=true&validateBankCode=true`
      );
      const data = await response.json();
      console.log({ data });
      if (data.valid) {
        bankDetails = data.bankData;
      } else {
        ibanInput.setCustomValidity($_("Invalid IBAN"));
        form.reportValidity();
      }
    } else {
      ibanInput.setCustomValidity(
        $_("The IBAN number must consist of 22 characters")
      );
      form.reportValidity();
    }
  };

  const createPersonalInformation = async () => {
    let URL = `${process.env.SVELTE_APP_REMOTE_URL}/api`;

    // read and update customer process status
    const item = localStorage.getItem("customerProcess");
    const customerProcess = item !== null ? JSON.parse(item as string) : null;

    localStorage.setItem(
      "customerProcess",
      JSON.stringify({
        ...customerProcess,
        personalInformation: false,
      })
    );

    if (!purchasePaybackId) {
      console.log("Must start the purchase process first");
      return;
    }

    const response = await handleFetchRetry(() =>
      fetch(`${URL}/personalinformations`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          address: JSON.stringify({
            city: formValues.cityValue,
            street: formValues.streetValue,
            zip: formValues.zipValue,
          }),
          email: formValues.email,
          name: formValues.nameValue,
          iban: formValues.iban,
          ibanVerified: "1",
        }),
      })
    );

    const personalInformation = await response.json();

    // set the personal information in localstorage
    localStorage.setItem(
      "personalInformation",
      JSON.stringify(personalInformation)
    );

    // update purchasePayback with personal information id
    await handleFetchRetry(() =>
      fetch(
        `${URL}/purchasepaybacks?${new URLSearchParams({
          where: JSON.stringify({
            id: purchasePaybackId,
          }),
        })}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            personalinformationId: personalInformation.id,
          }),
        }
      )
    );

    localStorage.setItem(
      "customerProcess",
      JSON.stringify({
        ...customerProcess,
        personalInformation: true,
      })
    );

    navigate("/step/4");
  };

  const checkValidity = async () => {
    ibanInput.setCustomValidity("");

    console.log(formValues);
    console.log(form.checkValidity());

    if (form.checkValidity()) {
      // test the iban number validity if the length is 21 or 22
      if (
        formValues.iban.replaceAll(" ", "").length === 21 ||
        formValues.iban.replaceAll(" ", "").length === 22
      ) {
        const iban = formValues.iban;

        // check if the iban is only from CH, AT, FR, LU, BE, NL
        const countryCode = iban.substring(0, 2);
        console.log({ countryCode });
        if (
          !["DE", "CH", "AT", "FR", "LU", "BE", "NL"].includes(
            countryCode.toUpperCase()
          )
        ) {
          ibanInput.setCustomValidity(
            $_(
              "This IBAN number does not meet the requirements of our terms and conditions. An account in the Federal Republic of Germany must be specified. Please provide a correct IBAN number."
            )
          );
          form.reportValidity();
        }

        const response = await fetch(
          `https://openiban.com/validate/${iban}?getBIC=true&validateBankCode=true`
        );
        const data = await response.json();
        console.log({ data });
        if (data.valid) {
          bankDetails = data.bankData;
        } else {
          ibanInput.setCustomValidity($_("Invalid IBAN"));
          form.reportValidity();
        }
      } else {
        ibanInput.setCustomValidity(
          $_("The IBAN number must consist of 22 characters")
        );
        form.reportValidity();
      }
    } else {
      form.reportValidity();
    }
  };

  const showMessageForInput = (e: any) => {
    if (e.target.value.length) {
      e.target.setCustomValidity("");
    } else e.target.setCustomValidity($_("F�lle dieses Feld aus."));
  };

  const showMessageForIban = (e: any) => {
    if (e.target.value.length) {
      e.target.setCustomValidity("");
    } else
      e.target.setCustomValidity($_("Please tell us your IBAN number here."));
  };
</script>

<div>
  <div>
    <h1 class="mb-8 title">{$_("Personal Information")}</h1>
    <p class="text-sm text-[#333] font-CorpoS">
      {$_("personal-info-intro")}
    </p>
    <br />

    <form action="" class="grid gap-3" bind:this={form}>
      <!-- Name -->
      <label>
        <div
          class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
        >
          {$_("NAME")}*
        </div>
        <input
          required
          type="text"
          class="input"
          bind:value={formValues.nameValue}
          on:invalid={showMessageForInput}
        />
      </label>

      <!-- Company -->
      <label>
        <div
          class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
        >
          {$_("COMPANY")}
        </div>

        <input type="text" class="input" bind:value={formValues.companyValue} />
      </label>

      <!-- Street -->

      <label class="flex-1">
        <div
          class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
        >
          {$_("STREET")}
        </div>
        <input type="text" class="input" bind:value={formValues.streetValue} />
      </label>

      <div class="flex gap-4">
        <!-- Zip Code -->
        <label class="!w-[calc(2*0.75rem+10ch)]">
          <div
            class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
          >
            {$_("ZIP CODE")}
          </div>

          <input type="text" class="input" bind:value={formValues.zipValue} />
        </label>

        <!-- City -->
        <label class="flex-1">
          <div
            class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
          >
            {$_("CITY")}*
          </div>
          <input
            required
            type="text"
            class="input"
            bind:value={formValues.cityValue}
            on:invalid={showMessageForInput}
          />
        </label>
      </div>
      <!-- Phone -->
      <!-- <label>
        <div
          class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
        >
          {$_("PHONE")}
        </div>
        <input type="tel" class="input" />
      </label> -->

      <!-- Email -->
      <label>
        <div
          class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
        >
          {$_("EMAIL")}*
        </div>

        <input
          required
          type="email"
          class="input"
          pattern={"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"}
          on:invalid={showMessageForInput}
          bind:value={formValues.email}
        />
      </label>

      <!-- IBAN -->
      <label>
        <div
          class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
        >
          {$_("IBAN")}*
        </div>

        <input
          required
          type="text"
          class="input"
          bind:value={formValues.iban}
          bind:this={ibanInput}
          on:input={() => {
            checkIban();
          }}
          on:invalid={showMessageForIban}
        />
      </label>
      {#if bankDetails !== null}
        <div class="flex gap-4">
          <div class="flex-1">
            <div
              class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
            >
              {$_("BANK NAME")}
            </div>
            <div class="text-sm text-[#333] font-CorpoS">
              {bankDetails.name}
            </div>
          </div>
          <div class="flex-1">
            <div
              class="text-xs uppercase font-semibold text-[#333] mb-1 font-CorpoS-Bold"
            >
              {$_("BIC")}
            </div>
            <div class="text-sm text-[#333] font-CorpoS">
              {bankDetails.bic}
            </div>
          </div>
        </div>
      {/if}
    </form>
  </div>

  <!-- Submit -->

  <div class="flex justify-end sticky bottom-0 py-4 bg-white font-CorpoS">
    <div class="pr-4 block sm:hidden">
      <Footer />
    </div>
    <div class="flex w-full justify-between">
      <p class="text-red-500">
        * {$_("required")}
      </p>
      <button
        class="button mt-4"
        type="submit"
        data-umami-event="next button on personal information clicked"
        data-umami-event-page="/step/3"
        on:click|preventDefault={async () => {
          await checkValidity();

          if (form.checkValidity()) {
            // try to create the personal information in the backend

            await createPersonalInformation();

            // redirect to step 4
          }
        }}>{$_("Next")}</button
      >
    </div>
  </div>
</div>
