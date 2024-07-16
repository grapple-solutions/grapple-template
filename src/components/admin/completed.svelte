<script>
  import("App/Purchasepaybacks").then((m) => {
    let module = m.default;

    new module({
      target: document.getElementById("completed"),
      layout: "auto",
      props: {
        dateFormat: "DD.MM.YYYY - HH:mm",
        filter: {
          limit: 10,
          where: {
            completed: 1,
            approved: 1,
            paid: 1,
            paidByMBD: 1,
          },
        },
        schema: {
          "field-properties": {
            "hidden-fields": [
              "paidDate",
              "paidByMbdDate",
            ],
          },
        }
      },
    });
  });
</script>

<div id="completed" />
