<script lang="ts">
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-navigator";
  import Footer from "../_shared/footer.svelte";

  import questions from "./questions.json";
  import { onMount } from "svelte";
  import { handleFetchRetry } from "../handleFetchRetry";

  interface response {
    [key: string]: string | null 
  }

  let responses: response = {};
  let purchasePaybackId: string;

  // read from localstorage
  if (localStorage.getItem("purchasePayBack") !== null) {
    purchasePaybackId = JSON.parse(
      localStorage.getItem("purchasePayBack") as string
    ).id;
  }

  const saveQuestions = async () => {
    // read and update customer process status
    const item = localStorage.getItem("customerProcess")
    const customerProcess = (item !== null) ? JSON.parse(item as string) : null;
    
    localStorage.setItem("customerProcess", JSON.stringify({
      ...customerProcess,
      questions: false,
    }));

    console.log({ responses });

    let URL = `${process.env.SVELTE_APP_REMOTE_URL}/api`;

    await handleFetchRetry(() => fetch(
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
          questions: JSON.stringify(responses),
        }),
      }
    ))

    localStorage.setItem("customerProcess", JSON.stringify({
      ...customerProcess,
      questions: true,
    }));

    navigate("/step/5");
  };

  onMount(() => {
    questions.map(q => {
      responses[q.question] = null
    })
  })
</script>

<div class="grid gap-4">
  <div
    class="grid gap-4 max-h-[calc(100vh-300px)] md:!max-h-[calc(100vh-200px)] overflow-auto "
  >
    <div class="mb-4 title">{$_("Our questions to you")}</div>

    <div class="text-[#767676] text-justify text-sm font-CorpoS">
      {$_(
        "With our cashback campaign, we would like to thank you for your loyalty and your thank trust. We would also like to develop this campaign further and so we would be very happy if you take the time and for answer the following questions for us. Our special thanks for this as well"
      )}
    </div>

    <ol class="grid gap-4 list-none">
      {#each questions as question, index}
        <li>
          <p class="font-CorpoS-Bold">
            <span class="text-[#767676] inline-block w-[2ch]">{index + 1}.</span
            >
            {question.question}
            {question.optional ? "(Optional)" : ""}
          </p>
          <div class="grid gap-2 mt-2 mb-4 text-sm">
            {#each question.options as option}
              <label class=" cursor-pointer flex gap-2">
                <input
                  type="radio"
                  name={question.question}
                  value={option}
                  on:change={(e) => {
                    // @ts-ignore
                    responses[question.question] = e.target.value;
                  }}
                />
                <span class="text-[#767676] font-CorpoS ">{option}</span>
              </label>
            {/each}
          </div>
        </li>
      {/each}
    </ol>
  </div>

  <div class="flex justify-end sticky bottom-0 py-4 bg-white">
    <div class="pr-4 block sm:hidden">
      <Footer />
    </div>
    <div>
      <button
        class="button"
        type="submit" data-umami-event="next button on questions page clicked" data-umami-event-page="/step/4"
        on:click|preventDefault={async () => {
          await saveQuestions();
        }}>{$_("Next")}</button
      >
    </div>
  </div>
</div>
