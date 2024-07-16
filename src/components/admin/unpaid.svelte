<script>
  import { onDestroy, onMount } from "svelte";
  let URL = `${process.env.SVELTE_APP_REMOTE_URL}/api`;

  const mountAdminView = () => {
    document.getElementById("unpaid").innerHTML = "";

    import("App/Purchasepaybacks").then((m) => {
      let module = m.default;

      new module({
        target: document.getElementById("unpaid"),
        layout: "auto",
        props: {
          dateFormat: "DD.MM.YYYY - HH:mm",
          filter: {
            limit: 10,
            where: {
              or: [
                {
                  completed: 1,
                  approved: 1,
                  paid: 0,
                },
                {
                  completed: 1,
                  approved: 1,
                  paid: null,
                },
              ],
            },
          },
          schema: {
            "field-properties": {
              "auto-generated-fields": ["id"],
              "boolean-fields": [
                "completed", 
                "personalinformationOverride", 
                "archived",
                "ibanVerified",
                "phoneVerified",
                "addressVerified",
                "dealerOverride",
                "partsOverrride",
                "purchaseDateOverride",
                "storageOverride",
                "switchOverride"
              ],
              "hidden-fields": [
                "rejectionReason",
                "paidDate", 
                "paidByMbdDate"
              ],
              "readonly-fields": [
                "id",
                "purchasereceipts",
                "purchasereceiptsId",
                "personalinformation",
                "personalinformationId"
              ],
              "relational-fields": [
                {
                  name: "personalinformation",
                  editable: true,
                  // columns: ["id", "name", "vorname", "geburtstag", "notizen"],
                },
                {
                  name: "purchasereceipts",
                  editable: true,
                  // columns: ["id", "name", "vorname", "geburtstag", "notizen"],
                }
              ],
              "dropdown-fields": [
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
              ],
              "json-fields": [
                {
                  field: "address",
                  template: "${street}, ${zip} ${city}",
                },
              ],
            },
            "custom-bulk-actions": [
              {
                action: "Refunded to the customer",
                bulkFn: async (rows) => {
                  const promises = rows.map((row) => {
                    return new Promise((resolve) => {
                      const event = new CustomEvent("refund", { detail: row });
                      window.dispatchEvent(event);
                      resolve();
                    });
                  });

                  console.log(promises);
                  return promises;
                },
                singleFn: (row) => {
                  const event = new CustomEvent("refund", { detail: row });
                  window.dispatchEvent(event);
                  // return selectedids;
                },
              },
            ],
          },
        },
      });
    });
  };
  onMount(() => {
    mountAdminView();
    // listen to the approve event in the global context
    // and update the state of the child component
    window.addEventListener("refund", (e) => {
      console.log(e.detail);
      refundToCustomer(e.detail.id);
    });
  });

  const refundToCustomer = async (id) => {
    await fetch(`${URL}/purchasepaybacks/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        paid: 1,
      }),
    });
    mountAdminView();
  };

  onDestroy(() => {
    // remove the event listener
    window.removeEventListener("refund", (e) => {
      console.log(e.detail);
    });
  });
</script>

<div id="unpaid" />
