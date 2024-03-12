<script>

  import dayjs from "dayjs";

  // demofullclassicmodelsasas
  let el1;
    import("host/Orders/count").then((module) => {
    const Count = module.default;
    new Count({
      target: el1,
      props: {
        // filter: { where:{ "customersId":363 } },
        // style: "disabled", // not working at the moment?!?!
        // css: "background-color: rgb(204 90 113 / var(--tw-bg-opacity));"
        // css: "display: none;"
      },

    });
  });
  

  let el2;
    import("host/Orders/findById").then((module) => {
    // import("host/Orders/updateById").then((module) => {
      const FindById = module.default;
    new FindById({
      target: el2,
      props: {
        id: 10100,
        // schema: { "field-properties": { "date-fields": [ { name: "orderDate", type: "date", }, { name: "requiredDate", type: "date", }, { name: "shippedDate", type: "time", }, ], }, },
        schema: { "field-properties": { "hidden-fields": [ "requiredDate" ], "field-order": [ "customerNumber", "customers", "status" ], } },
        dateFormat: 'DD.MM.YYYY - HH:mm',
        css: "color: orange;  font-weight: bold; border-color: orange; ",
        css: "display: none;"
      },
    });
  });  

  // MBD personal information testing:
  // let el2;
  //   import("host/Personalinformation/updateById").then((module) => {
  //   const FindById = module.default;
  //   new FindById({
  //     target: el2,
  //     props: {
  //       id: 50,
  //       schema: {
  //         "field-order": [ "name", "address", "email", "iban" ],
  //         "field-properties": { "hidden-fields": [ "id", "addressVerified", "addressGeolocation", "phoneVerified", "phone" ] },
  //         actions: {
  //           edit: {
  //             removable: false,
  //           },
  //         },
  //       },
  //     },
  //   });
  // });  

  let el3;
    import("host/Orders/find").then((module) => {
    const Find = module.default;
    new Find({
      target: el3,
      props: {
        filter: {"limit":10, "where":{"customersId":363}},
        schema: { "field-properties": { "hidden-fields": ["id", "comments", "requiredDate", "shippedDate", "customersId"], "date-fields": [ { name: "orderDate", type: "date", }, { name: "requiredDate", type: "date", }, { name: "shippedDate", type: "time", }, ], }, },
        translation: { 
          "orderDate": "Bestelldatum",
          "status": "Status",
          "Shipped": "Geliefert",
          "customers": "Kunde",
          "Filter": "Filtern",
          "No more items": "Es gibt keine weiteren Elemente mit diesen Kriterien",
          "Load More": "Weitere Elemente anzeigen"
        },
        dateFormat: 'DD.MM.YYYY - HH:mm',
        // useLocalTimezone: true,
        enableFilter: false, enableLoadMore: false, 
        // css: "color: orange;  font-weight: bold; border-color: orange; ",
        css: "font-size: 1vw; min-width: 8rem; padding:0.1rem; padding-left:.5rem; color: orange;  font-weight: bold; border-color: lightgray;",
        css: "display: none;"
      },

    });
  });


  let el4;
    import("host/Customers").then((module) => {
    // import("host/Purchasepaybacks").then((module) => {
      const MyOrders = module.default;
    new MyOrders({
      target: el4,
      layout: "auto",
      props: {
        // id: row.orders.id,
        filter: {"limit":15, "where":{"customersId":363}},
        schema: { "field-properties": { "hidden-fields": ["id", "comments", "requiredDate", "shippedDate", "customersId"], "date-fields": [ { name: "orderDate", type: "date", }, { name: "requiredDate", type: "date", }, { name: "shippedDate", type: "time", }, ], }, },
        // schema: { "field-properties": { "field-transformation": [ { name: "id", transformation: (value) => { return window.location.origin +"?id=" + value; }, }, ], } },
        translation: { 
          "orderDate": "Bestelldatum",
          "status": "Status",
          "Shipped": "Geliefert",
          "customers": "Kunde",
          "Filter": "Filtern",
          "No more items": "Es gibt keine weiteren Elemente mit diesen Kriterien",
          "Load More": "Weitere Elemente anzeigen"
        },
        dateFormat: 'DD.MM.YYYY - HH:mm',
        // useLocalTimezone: true,
        // enableFilter: false, enableLoadMore: false, enableNew: false,
        // css: "color: orange;  font-weight: bold; border-color: orange; ",
        // css: "font-size: 1vw; min-width: 8rem; padding:0.1rem; padding-left:.5rem; color: orange;  font-weight: bold; border-color: lightgray;",
        // schema: {
        //   "custom-bulk-actions": [
        //     {
        //       action: "demo",
        //       singleFn: () => {
        //         alert("test single");
        //       },
        //       bulkFn: (row) => {
        //         alert("test bulk");
        //       },
        //     },
        //   ],
        // },
        css: "display: none;",

      },
    });
  });


  // // testing defaultFilter
  // let el4;
  //   import("host/Rapport").then((module) => {
  //   // import("host/Purchasepaybacks").then((module) => {
  //     const MyOrders = module.default;
  //   new MyOrders({
  //     target: el4,
  //     layout: "auto",
  //     props: {
  //       dateFormat: 'DD.MM.YYYY - HH:mm',
  //       defaultFilter: { datum: {
  //           gt: dayjs().subtract(1, "month").format(),
  //           lt: dayjs().add(1, "month").format(),
  //         },
  //       },
  //       // css: "display: none;",
  //     },
  //   });
  // });

  // let el5;
  //   import("host/Auth/login").then((module) => {
  //   // import("host/Purchasepaybacks").then((module) => {
  //     const MyLogin = module.default;
  //   new MyLogin({
  //     target: el5,
  //     // layout: "auto",
  //     props: {
  //       // translation: { 
  //       //   "orderDate": "Bestelldatum",
  //       //   "status": "Status",
  //       //   "Shipped": "Geliefert",
  //       //   "customers": "Kunde",
  //       //   "Filter": "Filtern",
  //       //   "No more items": "Es gibt keine weiteren Elemente mit diesen Kriterien",
  //       //   "Load More": "Weitere Elemente anzeigen"
  //       // },
  //       // css: 'input[inputlabel="password"] { border-color: orange; };',
  //       // css: "color: orange;  font-weight: bold; border-color: orange; ",
  //       // css: "font-size: 1vw; min-width: 8rem; padding:0.1rem; padding-left:.5rem; color: orange;  font-weight: bold; border-color: lightgray;",
  //       css: "display: none;"
  //     },
  //   });
  // });


  // jcscherrer
  let el6;
    import("host/Kunde/findDropdown").then((module) => {
    const Count = module.default;
    new Count({
      target: el1,
      props: {
        filter: { where:{ "customersId":363 } },
        // style: "disabled", // not working at the moment?!?!
        // css: "background-color: rgb(204 90 113 / var(--tw-bg-opacity));"
        css: "display: none;"
      },

    });
  });


  // jcscherrer
  let el7;
    import("host/report").then((module) => {
    const Count = module.default;
    new Count({
      target: el7,
      props: {
        // filter: { where:{ "customersId":363 } },
        // style: "disabled", // not working at the moment?!?!
        // css: "background-color: rgb(204 90 113 / var(--tw-bg-opacity));"
        // css: "display: none;"
      },

    });
  });


</script>



<!-- 
  <script>
    let el1;
    // import("host/Customers/find").then((module) => {
    // import("host/Rapports/find").then((module) => {
      import("host/Orders/find").then((module) => {
      const Count = module.default;
      new Count({
        target: el1,
        props: {
          // id:1,
          dateFormat: 'DD.MM.YYYY - HH:mm',
          //   useLocalTimezone: true,
          style: 'primary',
          // css: "font-size: 1vw; min-width: 8rem; padding:0.1rem; color: orange;  font-weight: bold; border-color: lightgray;",
          // css: "color: orange;  font-weight: bold; border-color: orange; ",
          // filter: '{"limit":100 }',
          filter: {"limit":10, "where":{"customersId":363}},
          // filter: { "limit": 10,
          //     // "where": {"id":1002}
          //   },
          // filter: '{"limit":20,"include":["trainer","kunde","gruppe"],"where":{"trainerId":2}}',
          translation: { 
            "orderNumber": "Bestellung", 
            "orderDate": "Bestelldatum",
            "Shipped": "Ausgeliefert",
            // "Filter": "Filtern",
            "status": "Status",
            "customerNumber": "Kunde",
            // "Load More": "weitere..."
          },
          //whereFilter: '{"customerNumber":363}'
          "schema": {
            "field-properties": {
              "hidden-fields": ["requiredDate", "shippedDate"],
            }
          },
          enableFilter: true, 
          enableLoadMore: true, 
        },

      });
    });
  </script>
 -->
  
  <div class="max-w-6xl m-auto felx p-8">
    <!-- <div class="text-3xl">Customers, This is from the svelte application</div> -->
  
    <div class="p-8 grid gap-3">
      <div>
        <!-- <h2 class="text-xl">Count</h2> -->
        <div class="" bind:this={el1} style="width:350px;"/>
        <div class="" bind:this={el2} />
        <div class="" bind:this={el3} />
        <div class="" bind:this={el4} />
        <!-- <div class="" bind:this={el5} style="width:750px;" /> -->
        <div class="" bind:this={el6} style="width:250px;"/>
        <div class="" bind:this={el7} />
      </div>
    </div>
  </div>
  