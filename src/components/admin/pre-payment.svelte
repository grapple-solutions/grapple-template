<script>
  import { onDestroy, onMount } from "svelte";
  import { dayjs } from "../../lib/dayjs";

  let URL = `${process.env.SVELTE_APP_REMOTE_URL}/api`;

  const mountAdminView = () => {
    document.getElementById("pre-payment").innerHTML = "";

    import("App/Purchasepaybacks").then((m) => {
      let module = m.default;

      new module({
        target: document.getElementById("pre-payment"),
        layout: "auto",
        props: {
          dateFormat: "DD.MM.YYYY - HH:mm",
          filter: {
            limit: 10,
            where: {
              and: [
                {
                  completed: 1,
                  status: "PRE-PAYMENT",
                },
              ],
            },
          },
          defaultFilter: {
            date: {
              lt: dayjs().format(),
              gt: dayjs().subtract(30, "day").format(),
            },
          },
          quickFilters: [
            {
              label: "Last 30 days",
              filter: {
                date: {
                  lt: dayjs().format(),
                  gt: dayjs().subtract(30, "day").format(),
                },
              },
            },
            {
              label: "Last 60 days",
              filter: {
                date: {
                  lt: dayjs().format(),
                  gt: dayjs().subtract(60, "day").format(),
                },
              },
            },
            {
              label: "Last 90 days",
              filter: {
                date: {
                  lt: dayjs().format(),
                  gt: dayjs().subtract(90, "day").format(),
                },
              },
            },
          ],
          schema: {
            "field-properties": {
              "field-transformation": [
                {
                  name: "date",
                  transformation: (value) => {
                    return dayjs(value)
                      .tz("Europe/Berlin")
                      .locale("de-DE")
                      .format("DD.MM.YYYY - HH:mm");
                  },
                },
              ],
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
                "switchOverride",
              ],
              "hidden-fields": ["rejectionReason", "paidDate", "paidByMbdDate"],
              "readonly-fields": [
                "id",
                "purchasereceipts",
                "purchasereceiptsId",
                "personalinformation",
                "personalinformationId",
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
                },
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
                action: "Approve",
                bulkFn: async (rows) => {
                  const promises = rows.map((row) => {
                    return new Promise((resolve) => {
                      const event = new CustomEvent("updateRow", {
                        detail: {
                          rowId: row,
                          fields: {
                            status: "APPROVED",
                          },
                        },
                      });
                      window.dispatchEvent(event);
                      resolve();
                    });
                  });

                  console.log(promises);
                  return promises;
                },
                singleFn: (row) => {
                  const event = new CustomEvent("updateRow", {
                    detail: {
                      rowId: row.id,
                      fields: {
                        status: "APPROVED",
                      },
                    },
                  });
                  window.dispatchEvent(event);
                  // return selectedids;
                },
              },
              {
                action: "Paid",
                bulkFn: async (rows) => {
                  const promises = rows.map((row) => {
                    return new Promise((resolve) => {
                      const event = new CustomEvent("updateRow", {
                        detail: {
                          rowId: row,
                          fields: {
                            status: "PAID",
                          },
                        },
                      });
                      window.dispatchEvent(event);
                      resolve();
                    });
                  });

                  console.log(promises);
                  return promises;
                },
                singleFn: (row) => {
                  const event = new CustomEvent("updateRow", {
                    detail: {
                      rowId: row.id,
                      fields: {
                        status: "PAID",
                      },
                    },
                  });
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

  const updateRow = async (rowId, fields) => {
    await fetch(`${URL}/purchasepaybacks/${rowId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(fields),
    });
    mountAdminView();
  };

  onMount(() => {
    mountAdminView();
    // listen to the updateRow event in the global context
    // and update the state of the child component
    window.addEventListener("updateRow", (e) => {
      updateRow(e.detail.rowId, e.detail.fields);
    });
  });

  onDestroy(() => {
    // remove the event listener
    window.removeEventListener("updateRow", (e) => {
      console.log(e.detail);
    });
  });
</script>

<div id="pre-payment" />
