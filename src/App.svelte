<script>
  import dayjs from "dayjs";

  // demofullclassicmodelsasas
  let el1;
  import("App/Employees/count").then((module) => {
    const Count = module.default;
    new Count({
      target: el1,
      props: {
        // filter: { where:{ "postalCode":44000 } },
        // css: "background-color: rgb(204 90 113 / var(--tw-bg-opacity));"
        // css: "display: none;"
      },
    });
  });

  let el2;
  import("App/Employees/findById").then((module) => {
    // import("App/Orders/updateById").then((module) => {
    const FindById = module.default;
    new FindById({
      target: el2,
      props: {
        id: 1002,
        schema: {
          "field-properties": {
            "field-order": [
              "id",
              "customerName",
              "contactLastName",
              "contactFirstName",
              "postalCode",
              "city",
              "country",
            ],
            "hidden-fields": ["state", "addressLine2", "creditLimit"],
            "date-fields": [
              { name: "orderDate", type: "date" },
              { name: "shippedDate", type: "time" },
            ],
          },
        },
        // dateFormat: 'DD.MM.YYYY - HH:mm',
        // css: "color: orange;  font-weight: bold; border-color: orange; ",
        // css: "display: none;"
      },
    });
  });

  let el3;
  import("App/Employees/find").then((module) => {
    const Find = module.default;
    new Find({
      target: el3,
      props: {
        // filter: {"limit":10, "where":{"customersId":363}},
        filter: { limit: 10 },
        schema: {
          "field-properties": {
            "field-order": [
              "id",
              "customerName",
              "contactLastName",
              "contactFirstName",
              "postalCode",
              "city",
              "country",
            ],
            "hidden-fields": ["state", "addressLine2", "creditLimit"],
            "date-fields": [
              { name: "orderDate", type: "date" },
              { name: "shippedDate", type: "time" },
            ],
          },
        },
        translation: {
          customerName: "Name des Kunden",
          contactLastName: "Nachname",
          contactFirstName: "Vorname",
          postalCode: "PLZ",
          city: "Ort",
          "No more items":
            "Es gibt keine weiteren Elemente mit diesen Kriterien",
          "Load More": "Weitere Elemente anzeigen",
        },
        // dateFormat: 'DD.MM.YYYY - HH:mm',
        // // useLocalTimezone: true,
        enableFilter: false,
        enableLoadMore: false,
        // css: "color: orange;  font-weight: bold; border-color: orange; ",
        // css: "font-size: 1vw; min-width: 8rem; padding:0.1rem; padding-left:.5rem; color: orange;  font-weight: bold; border-color: lightgray;",
        // css: "display: none;"
      },
    });
  });
</script>

<div class="max-w-6xl m-auto felx p-8">
  <!-- <div class="text-3xl">Customers, This is from the svelte application</div> -->

  <div class="p-8 grid gap-3">
    <div>
      <!-- <h2 class="text-xl">Count</h2> -->
      <div class="uimodule" bind:this={el1} style="width:350px;" />
      <div class="uimodule" bind:this={el2} />
      <div class="uimodule" bind:this={el3} />
    </div>
  </div>
</div>
