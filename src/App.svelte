<script lang="ts">
  import { Router, Route } from "svelte-navigator";

  import Header from "./components/header.svelte";
  import PersonalInformation from "./components/personal-information/personal-information.svelte";
  import PurchaseInformation from "./components/purchase-information/purchase-information.svelte";
  import Questions from "./components/questions/questions.svelte";
  import Registration from "./components/registration/registration.svelte";
  import New from "./components/admin/new.svelte";

  import SideBar from "./components/side-bar.svelte";

  import Toasts from "./components/_shared/toasts.svelte";
  import Welcome from "./components/welcome/welcome.svelte";
  import TermsAndPrivacy from "./components/terms/terms-and-privacy.svelte";
  import Paid from "./components/admin/paid.svelte";
  import AdminSideBar from "./components/admin/admin-side-bar.svelte";
  import Footer from "./components/_shared/footer.svelte";
  import Auth from "./components/auth/auth.svelte";
  import RegistrationIsOver from "./components/registration-is-over/registration-is-over.svelte";
  import PreApproved from "./components/admin/pre-approved.svelte";
  import Verification from "./components/admin/verification.svelte";
  import Approved from "./components/admin/approved.svelte";
  import Rejected from "./components/admin/rejected.svelte";
  import Incomplete from "./components/admin/incomplete.svelte";
  import PrePayment from "./components/admin/pre-payment.svelte";
  import RegistrationNotYetStarted from "./components/registration-not-yet-started/registration-not-yet-started.svelte";
  import Personalinformation from "./components/admin/personalinformation.svelte";

  // read recognizedText from localstorage
  // const result = JSON.parse(localStorage.getItem("recognizedText") || "{}");

  // console.log({ result });

  // const url = new URL(window.location.href);

  // const debugMode = url.searchParams.get("debug") === "true";

  let authed: string | boolean | null = localStorage.getItem("auth");

  if (authed) {
    authed = true;
  }

  let isAppActive = false;
  let isStartingInFuture = false;

  try {
    const appStartDate = new Date(process.env.SVELTE_APP_APP_START_DATE!);
    const appEndDate = new Date(process.env.SVELTE_APP_APP_END_DATE!);
    const now = new Date();
    isAppActive = now >= appStartDate && now <= appEndDate;
  } catch (e) {
    isAppActive = true;
  }

  try {
    const appStartDate = new Date(process.env.SVELTE_APP_APP_START_DATE!);
    const appEndDate = new Date(process.env.SVELTE_APP_APP_END_DATE!);
    const now = new Date();
    isStartingInFuture = now < appStartDate;
  } catch (e) {
    isStartingInFuture = false;
  }

  let webSiteId = "b15f1c93-1b5d-4d25-b8e5-5d49f1bb35ac";
  try {
    const umamiId = process.env.SVELTE_APP_UMAMI_ID!;
    webSiteId = umamiId
    console.log("umamiId is:" + umamiId)
  } catch (e) {
    webSiteId = "";
    console.log("umamiId is not defined")
  }

</script>

<svelte:head>
  {#if window.location.href.includes("localhost")}
    <script async defer data-website-id="b15f1c93-1b5d-4d25-b8e5-5d49f1bb35ac" src="http://umami.nop.cloud20x.com/umami"></script>
  {:else if window.location.href.includes("nop")}
    <script async defer data-website-id="b15f1c93-1b5d-4d25-b8e5-5d49f1bb35ac" src="/umami/umami"></script>
  {:else}
    <script async defer data-website-id="{webSiteId}" src="/umami/umami"></script>
  {/if}
</svelte:head>

<svelte:window on:load={() => {
  if(!("umami" in window)) {
    window["umami"] = {
      track: () => null,
      identify: () => null,
    };
  }    
}}></svelte:window>

<Toasts />
<Router primary={false}>
  {#if window.location.href.includes("admin")}
    {#if !authed}
      <Auth />
    {:else}
      <div class="flex">
        <div class="flex-shrink-0">
          <AdminSideBar />
        </div>
        <div class="flex-1 p-4 md:p-6 pb-16">
          <Route path="/admin/new" component={New} />
          <Route path="/admin/pre-approved" component={PreApproved} />
          <Route path="/admin/verification" component={Verification} />
          <Route path="/admin/approved" component={Approved} />
          <Route path="/admin/pre-payment" component={PrePayment} />
          <Route path="/admin/paid" component={Paid} />
          <Route path="/admin/rejected" component={Rejected} />
          <Route path="/admin/incomplete" component={Incomplete} />
          <Route path="/admin/personalinformation" component={Personalinformation} />
        </div>
      </div>
    {/if}
  {:else}
    <div class="flex flex-col ">
      <Header />
      <div
        class="min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] overflow-y-auto"
      >
        <div
          class="py-8 px-8 flex gap-8 flex-col md:!flex-row md:!justify-around  md:!max-w-7xl  mx-auto w-full min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)]  "
        >
          {#if isAppActive}
            <div class="w-[100%] md:w-[35%] self-start ">
              <SideBar />
            </div>
            <div class="w-[100%] md:w-[65%] flex-1  flex ">
              <Route path="/step/0" component={Welcome} />
              <Route path="/step/1">
                <Registration />
              </Route>
              <Route path="/step/2" component={PurchaseInformation} />
              <Route path="/step/3" component={PersonalInformation} />
              <Route path="/step/4" component={Questions} />
              <Route path="/step/5" component={TermsAndPrivacy} />
            </div>
          {:else}
            {#if isStartingInFuture}
            <RegistrationNotYetStarted />
            {:else}          
            <RegistrationIsOver />
            {/if}
          {/if}
          </div>
      </div>
      <div class="fixed bottom-0 p-4   bg-gray-50 w-full hidden sm:block">
        <Footer />
      </div>
    </div>
  {/if}
</Router>
