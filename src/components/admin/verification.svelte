<script>
  import { dayjs } from "../../lib/dayjs";
  import { onDestroy, onMount } from "svelte";
  import VerifyAndApprove from "./verify-and-approve.svelte";
  import RejectionReasonModal from "../_shared/RejectionReasonModal.svelte";

  let row = null;
  let URL = `${process.env.SVELTE_APP_REMOTE_URL}/api`;

  const mountAdminView = () => {
    document.getElementById("verification").innerHTML = "";

    import("App/Purchasepaybacks").then((m) => {
      let module = m.default;

      new module({
        target: document.getElementById("verification"),
        layout: "auto",
        props: {
          dateFormat: "DD.MM.YYYY - HH:mm",
          filter: {
            limit: 10,
            where: {
              and: [
                {
                  completed: 1,
                  status: "VERIFICATION",
                },
              ],
            },
          },
          defaultFilter: {
            date: {
              lt: dayjs().format(),
              gt: dayjs().subtract(7, "day").format(),
            },
          },
          quickFilters: [
            {
              label: "Last day",
              filter: {
                date: {
                  lt: dayjs().format(),
                  gt: dayjs().subtract(1, "day").format(),
                },
              },
            },
            {
              label: "Last 2 days",
              filter: {
                date: {
                  lt: dayjs().format(),
                  gt: dayjs().subtract(2, "day").format(),
                },
              },
            },
            {
              label: "Last 3 days",
              filter: {
                date: {
                  lt: dayjs().format(),
                  gt: dayjs().subtract(3, "day").format(),
                },
              },
            },
            {
              label: "Last 5 days",
              filter: {
                date: {
                  lt: dayjs().format(),
                  gt: dayjs().subtract(5, "day").format(),
                },
              },
            },
            {
              label: "Last 7 days",
              filter: {
                date: {
                  lt: dayjs().format(),
                  gt: dayjs().subtract(7, "day").format(),
                },
              },
            },
            {
              label: "Last 30 days",
              filter: {
                date: {
                  lt: dayjs().format(),
                  gt: dayjs().subtract(30, "day").format(),
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
                action: "Incomplete",
                bulkFn: async (rows) => {
                  const promises = rows.map((row) => {
                    return new Promise((resolve) => {
                      const event = new CustomEvent("updateRow", {
                        detail: {
                          rowId: row,
                          fields: {
                            status: "INCOMPLETE",
                          },
                        },
                      });
                      window.dispatchEvent(event);
                      resolve();
                    });
                  });

                  return promises;
                },
                singleFn: (row) => {
                  const event = new CustomEvent("updateRow", {
                    detail: {
                      rowId: row.id,
                      fields: {
                        status: "INCOMPLETE",
                      },
                    },
                  });
                  window.dispatchEvent(event);
                  // return selectedids;
                },
              },
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
                action: "Reject",
                bulkFn: async (rows) => {
                  const promises = rows.map((row) => {
                    return new Promise((resolve) => {
                      const event = new CustomEvent("updateRow", {
                        detail: {
                          rowId: row,
                          fields: {
                            status: "REJECTED",
                          },
                        },
                      });
                      window.dispatchEvent(event);
                      resolve();
                    });
                  });

                  return promises;
                },
                singleFn: (row) => {
                  rowInstance = row;
                  rejectionReasonModalOpen = true;
                  // return selectedids;
                },
              },
              {
                action: "Verify and Approve",
                singleFn: (row) => {
                  const event = new CustomEvent("approve", { detail: row });
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

  let rowInstance = null;
  let rejectionReason = "";
  let rejectionReasonModalOpen = false;

  const closeModal = () => (rejectionReasonModalOpen = false);

  const confirmRejection = async () => {
    const event = new CustomEvent("updateRow", {
      detail: {
        rowId: rowInstance.id,
        fields: {
          status: "REJECTED",
          rejectionReason,
        },
      },
    });
    window.dispatchEvent(event);
    closeModal();
  };
</script>

<!-- Adobe Embed API -->
<!-- <svelte:head>
  <script src="https://acrobatservices.adobe.com/view-sdk/viewer.js"></script>
</svelte:head> -->

<RejectionReasonModal
  bind:inputValue={rejectionReason}
  submitFunction={confirmRejection}
  bind:open={rejectionReasonModalOpen}
/>

<VerifyAndApprove {mountAdminView} bind:row />

<div id="verification" />
