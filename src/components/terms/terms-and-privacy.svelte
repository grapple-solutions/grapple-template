<script lang="ts">
  // import { isTermsValidationComplete } from "../../store/stepper/steps";

  import { _ } from "svelte-i18n";
  import Terms from "./terms.svelte";
  import Privacy from "./privacy.svelte";
  import Footer from "../_shared/footer.svelte";
  import mbdPrivacyReferences from "../../assets/MBD-Datenschutzhinweise_2022-09.pdf";
  import mbdPrivacy from "../../assets/MBD-Datenschutzrichtlinie-de.pdf";
  import mbdParticipation from "../../assets/MBD-Teilnahmebedingungen_2023-08.pdf";
  import mbdWinterPrivacyReferences from "../../assets/MBD-Winterkomplettrad-Datenschutzhinweisblatt_2022-09.pdf";
  import { handleFetchRetry } from "../handleFetchRetry";
  
  // interface IValidationObj {
  //   [key: string]: boolean | string
  // };

  let showTerms = false;
  // let umami;
  let showPrivacy = false;
  let purchasePaybackId: string;
  let URL = `${process.env.SVELTE_APP_REMOTE_URL}/api`;

  // read from localstorage
  if (localStorage.getItem("purchasePayBack") !== null) {
    purchasePaybackId = JSON.parse(
      localStorage.getItem("purchasePayBack") as string
    ).id;
  }

  let showThankYouMessage = false;

  const isValidPurchaseDate = (dateString: string): boolean => {
    const ed = process.env.SVELTE_APP_APP_END_DATE?.split("-");
    const sd = process.env.SVELTE_APP_APP_START_DATE?.split("-");

    if(ed && sd) {
      const startDate = new Date(Date.UTC(+sd[0], +sd[1] - 1, +sd[2]));
      const endDate = new Date(Date.UTC(+ed[0], +ed[1] - 1, +ed[2]));
      const purchaseDate = new Date(dateString);

      if(purchaseDate > startDate && purchaseDate < endDate)  
      return true;
    }
    return false;
  }

  const defineStatus = async () => {
    let receiptInformation = null;
    let purchasePaybackInformation = null;

    if(localStorage.getItem("receipt")) 
      receiptInformation = JSON.parse(localStorage.getItem("receipt") as string);
    if(localStorage.getItem("purchasePayBack")) 
      purchasePaybackInformation = JSON.parse(localStorage.getItem("purchasePayBack") as string);
    
    if(!!receiptInformation || !!purchasePaybackInformation) 
      return "VERIFICATION";

    if(receiptInformation.partsCount !== '4'
      || JSON.parse(receiptInformation.partsId).length <= 0) {
      return "VERIFICATION";
    }

    const requests = [
      `${URL}/purchasereceipts/${purchasePaybackInformation.purchasereceiptsId}`,
      `${URL}/purchasepaybacks/${purchasePaybackInformation.id}`,
      `${URL}/dealerships/${receiptInformation.dealershipsId}`
    ];

    let isValidDealership = null;
    let validPurchaseDate = null;
    let storageIsNotEmpty = null;
    let noOverridedValues = null;

    await Promise.all(requests.map(r => fetch(r)))
      .then(async res => {
        const purchaseReceiptsResult = await res[0].json();
        const purchasePaybacksResult = await res[1].json();

        const overrideFields = Object.keys(purchaseReceiptsResult)
          .filter(k => k.includes("Override"))

        for(let k = 0; k < overrideFields.length; k++) {
          if(purchaseReceiptsResult[overrideFields[k]]) {
            k = overrideFields.length;
          } else {
            if(k == overrideFields.length - 1) 
              noOverridedValues = true;
          }
        }

        isValidDealership = res[2].status == 200;
        storageIsNotEmpty = !!purchaseReceiptsResult.storage;
        validPurchaseDate = isValidPurchaseDate(purchasePaybacksResult.date);
      })
      .catch(error => console.log({ error }))

    if(!isValidDealership || !storageIsNotEmpty 
      || !validPurchaseDate || noOverridedValues) 
      return "VERIFICATION";

    return "PRE-APPROVED";
  }

  const updatePurchasePayback = async () => {
    // umami.track(props => ({ ...props, url: '/step/6', title: 'Submitted' }))

    // const item = localStorage.getItem("customerProcess");
    // const customerProcess = (item !== null) ? JSON.parse(item) : null;

    // const validationObj: IValidationObj = {
    //   personalInformation: true,
    //   registration: true,
    //   questions: true,
    // };

    // if(customerProcess == null) {
    //   status = "VERIFICATION";
    // } else {
    //   const validationKeys = Object.keys(validationObj);
      
    //   validationKeys.map(k => {
    //     if(customerProcess[k] !== validationObj[k]) {
    //       status = "VERIFICATION";
    //     };
    //   });
    // };

    let receiptInformation: any = null;

    if(localStorage.getItem("receipt"))
      receiptInformation = JSON.parse(localStorage.getItem("receipt") as string);

    const response = await handleFetchRetry(async () => fetch(
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
          completed: 1,
          status: await defineStatus(),
          cashbackType: receiptInformation?.storage ? "cashback-full" : "cashback-basic",
        }),
      }
    ));

    if (response.status === 200) {
      // read personalInformation from localstorage
      const personalInformation = JSON.parse(
        localStorage.getItem("personalInformation") as string
      );
      // send email
      await fetch(
        "https://gquwtyo6zi.execute-api.eu-central-1.amazonaws.com/send-email",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            email: personalInformation.email,
            name: personalInformation.name,
          }),
        }
      );

      showThankYouMessage = true;
    } else {
      console.log("error saving purchasePayback request");
    }
  };
</script>

<div class="relative">
  <div class="grid gap-3 font-CorpoS">
    <div
      class="max-h-[calc(100vh-350px)]  md:!max-h-[calc(100vh-200px)] overflow-y-auto grid gap-4 "
    >
      <div class="mb-8 title">
        {$_("Terms & Conditions")}
      </div>

      <div class="text-sm">
<!-- deactivated as requested by MBD on 19.07.2023
        {$_(
          "By clicking on 'send application' your details will be saved and forwarded submitted for quick review."
        )}
-->
<!-- deactivated as requested by MBD on 30.09.2022
        <br />
        <br />

        {$_(
          "The personal data provided in the cashback application, in particular Name, address, email address, bank details, solely for the purpose of Execution of the resulting contractual relationship necessary and are required based on legal permissions raised."
        )}

        <br />
        <br />
        {$_(
          "By clicking on *'Send application', I consent to Mercedes-Benz or a service provider sending me information by email for the purpose of carrying out the cashback refund. Any further use of the personal data and the collection of additional information for advertising purposes is not intended."
        )}
-->

<!-- deactivated as requested by MBD on 19.07.2023
        <br />
        <br />
-->
        {$_("The")}
        <!-- <span
          class="text-primary-500 cursor-pointer font-CorpoS-Bold"
          on:click={() => (showTerms = true)}
        >
          {$_("Terms and Conditions")}</span
        > -->
        <a
          href={mbdParticipation}
          download
          class="text-primary-500 cursor-pointer font-CorpoS-Bold"
          >{$_("Terms and Conditions")}</a
        >
        {$_("for the cashback action and the")}
        <!-- <span
          class="text-primary-500 cursor-pointer font-CorpoS-Bold"
          on:click={() => (showPrivacy = true)}
        >
          {$_("Privacy Policy")}</span
        > -->

<!--  deactivated as requested by MBD on 30.09.2022
        <a
          href={mbdPrivacy}
          download
          class="text-primary-500 cursor-pointer font-CorpoS-Bold"
          >{$_("Privacy Policy")}</a
        >
        {$_("of Mercedes-Benz AG apply.")} 
-->

        <br />
        <br />
        {$_("data protection references before")}
        <a
          href={mbdWinterPrivacyReferences}
          download
          class="text-primary-500 cursor-pointer font-CorpoS-Bold"
          >{$_("data protection references")}</a
        >
        {$_("data protection references after")}

<!--  deactivated as requested by MBD on 30.09.2022
        <br />
        <br />
        {$_("cookies explanation")}
-->
      </div>
    </div>
    <div
      class="flex gap-2 justify-between items-center sticky bottom-0 py-4 bg-white font-CorpoS"
    >
      <span
        >{$_(
          "With clicking on Submit, I accept the terms and conditions."
        )}</span
      >
      <button
        class="button" data-umami-event="submit button on the last page clicked" data-umami-event-page="/step/5"
        on:click={async () => {
          await updatePurchasePayback();
        }}>{$_("Submit")}</button
      >

      {#if showThankYouMessage}
        <div
          class="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
          >
            <div
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            />

            <span
              class="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true">&#8203;</span
            >

            <div
              class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
            >
              <div>
                <div
                  class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
                >
                  <!-- Heroicon name: outline/check -->
                  <svg
                    class="h-6 w-6 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <h3
                    class="text-lg leading-6 font-medium text-gray-900 font-CorpoA"
                    id="modal-title"
                  >
                    {$_("Thank you for your participation!")}
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 font-CorpoS">
                      {$_(
                        "We will inform you via email about the status of your application"
                      )}
                    </p>
                  </div>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 font-CorpoS">
                      {$_(
                        "Close window"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}

      {#if showTerms}
        <div
          class="fixed z-50 inset-0 overflow-y-auto flex justify-center items-center"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            class="fixed inset-0  bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          />
          <div
            class="flex flex-1 w-full  items-center justify-center min-h-screen pt-4 px-4"
          >
            <div
              class="w-full md:w-11/12 lg:w-9/12 relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all "
            >
              <div class="flex justify-end">
                <button
                  type="button"
                  class="button text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                  data-modal-toggle="defaultModal"
                  on:click={() => {
                    showTerms = false;
                  }}
                >
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    ><path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    /></svg
                  >
                  <span class="sr-only">Close modal</span>
                </button>
              </div>

              <Terms />
            </div>
          </div>
        </div>
      {/if}

      {#if showPrivacy}
        <div
          class="fixed z-50 inset-0 overflow-y-auto flex justify-center items-center"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            class="fixed inset-0  bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          />
          <div
            class="flex flex-1 w-full  items-center justify-center min-h-screen pt-4 px-4"
          >
            <div
              class="w-full md:w-11/12 lg:w-9/12 relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all"
            >
              <div class="flex justify-end">
                <button
                  type="button"
                  class="button text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                  data-modal-toggle="defaultModal"
                  on:click={() => {
                    showPrivacy = false;
                  }}
                >
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    ><path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    /></svg
                  >
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <Privacy />
            </div>
          </div>
        </div>
      {/if}
    </div>
    <div class="pr-4 block sm:hidden">
      <Footer />
    </div>
  </div>
</div>
