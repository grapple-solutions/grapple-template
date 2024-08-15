<script>
  import dayjs from "dayjs";

  // demofullclassicmodelsasas
  let el1;
  import("App/Organisations").then((module) => {
    const Count = module.default;
    new Count({
      target: el1,
      props: {
        translation: {
          Actions: "Aktionen",
          name: "Name des Unternehmens",
          id: "Kennung",
          "No more items":
            "Es gibt keine weiteren Elemente mit diesen Kriterien",
          "Load More": "Weitere Elemente anzeigen",
          "New": "Neues Unternehmen",
          "Select All Items": "alle Unternehmen selektieren"
        },
        // filter: { where:{ "postalCode":44000 } },
        // css: "background-color: rgb(204 90 113 / var(--tw-bg-opacity));"
        // css: "display: none;"
      },
    });
  });

  let el2;
  import("App/Users/findById").then((module) => {
    // import("App/Orders/updateById").then((module) => {
    const FindById = module.default;
    new FindById({
      target: el2,
      props: {
        id: "7f72cb00-5ad8-11ef-bca9-b1e91a7f9854",
        schema: {
          "field-properties": {
            "field-order": [
              "name",
              "address",
              "organisations",
              "moveindate"
            ],
            "hidden-fields": ["id"],
            "date-fields": [
              { name: "moveindate", type: "date" },
            ],
          },
        },
        dateFormat: 'DD.MM.YYYY',
        // css: "color: orange;  font-weight: bold; border-color: orange; ",
        // css: "display: none;"
      },
    });
  });

  let el3;
  import("App/Users").then((module) => {
    const Find = module.default;
    new Find({
      target: el3,
      props: {
        // filter: {"limit":10, "where":{"customersId":363}},
        filter: { limit: 10 },
        schema: {
          "field-properties": {
            "field-order": [
              "name",
              "address",
              "organisations",
              "moveindate",
              "id",
            ],
            // "hidden-fields": ["id"],
            "date-fields": [
              { name: "moveindate", type: "date" },
            ],
          },
        },
        translation: {
          Actions: "Aktionen",
          name: "Name des Benutzers",
          address: "Adresse",
          organisations: "Unternehmen",
          moveindate: "Beginn der Nutzung",
          id: "Kennung",
          "No more items":
            "Es gibt keine weiteren Elemente mit diesen Kriterien",
          "Load More": "Weitere Elemente anzeigen",
          "New": "Neuen Benutzer",
          "Select All Items": "alle Benutzer selektieren"
        },
        dateFormat: 'DD.MM.YYYY',
        // // useLocalTimezone: true,
        enableFilter: true,
        // css: "display: none;"
      },
    });
  });
</script>

<div class="max-w-6xl m-auto felx p-8" style="padding:20px">
  <!-- <div class="text-3xl">Customers, This is from the svelte application</div> -->

  <div class="p-8 grid gap-3">
    <div>
      <h2 class="text-xl">Unternehmen (organisations):</h2>
      <div class="uimodule1" bind:this={el1} />

      <br /><br /><hr style="border-top-width:10px;" /><br /><br />

      <h2 class="text-xl">Benutzer (users):</h2>
      <div class="uimodule3" bind:this={el3} />

      <br /><br /><hr style="border-top-width:10px;" /><br /><br />

      <h2 class="text-xl">einzelner Benutzer (user):</h2>
      <div class="uimodule2" bind:this={el2} />

    </div>
  </div>
</div>
