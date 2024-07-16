<script>
  //   import Grid from "../../../assets/icons/grid.svg.svelte";
  //   import MapPin from "../../../assets/icons/map-pin.svg.svelte";
  //   import PersonBadge from "../../../assets/icons/person-badge.svg.svelte";
  //   import Receipt from "../../../assets/icons/receipt.svg.svelte";
  //   import User from "../../../assets/icons/user.svg.svelte";
  //   import Users from "../../../assets/icons/users.svg.svelte";
  import { _ } from "svelte-i18n";
  import { Link, navigate, useLocation } from "svelte-navigator";
  // import Repeat from "../../../assets/icons/repeat.svg.svelte";
  import Logo from "../../assets/icons/logo.svg.svelte";
  //   import SmallLogo from "../../../assets/images/jcs-logo.png";
  const location = useLocation();

  location.subscribe((loc) => {
    console.log(loc);
    if (loc.pathname == "/admin") {
      navigate("/admin/new");
    }
  });
</script>

<div
  class="nav-container max-w-xs min-h-screen h-screen flex flex-col flex-grow border-r border-gray-200 sm:pt-5 sm:pb-4 bg-white overflow-auto">
  <div class="flex items-center flex-shrink-0 px-4 space-y-5">
    <Link to="/admin" title="Admin">
      <div class="grid gap-4">
        <div class="flex justify-center">
          <Logo />
        </div>
        <div>
          <h1 class="text-2xl font-CorpoA">
            {$_("MBD Purchase Payback Registration")}
          </h1>
        </div>
      </div>

      <!-- <img class="h-6 sm:h-10 w-auto  lg:hidden" src={SmallLogo} alt="JCS" /> -->
    </Link>
  </div>
  <div class=" sm:mt-5 flex-grow flex flex-col">
    <nav class="nav-items flex-1 bg-white sm:space-y-3" aria-label="Sidebar">
      <Link
        title="New"
        class="{$location.pathname === '/admin/new'
          ? 'bg-primary-50 border-primary-600 text-primary-600'
          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}  group flex justify-center lg:!justify-start items-center px-3 py-2 text-sm font-medium border-t-4 sm:border-l-4 sm:border-t-0 flex-1"
        to="/admin/new">
        <!-- <Repeat class=" text-primary-500 lg:mr-3 flex-shrink-0 h-6 w-6" /> -->
        <span class="hidden hide-nav-item">New</span>
      </Link>

      <Link
        title="New"
        class="{$location.pathname === '/admin/pre-approved'
          ? 'bg-primary-50 border-primary-600 text-primary-600'
          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}  group flex justify-center lg:!justify-start items-center px-3 py-2 text-sm font-medium border-t-4 sm:border-l-4 sm:border-t-0 flex-1"
        to="/admin/pre-approved">
        <!-- <Repeat class=" text-primary-500 lg:mr-3 flex-shrink-0 h-6 w-6" /> -->
        <span class="hidden hide-nav-item">Pre-approved</span>
      </Link>

      <Link
        title="New"
        class="{$location.pathname === '/admin/verification'
          ? 'bg-primary-50 border-primary-600 text-primary-600'
          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}  group flex justify-center lg:!justify-start items-center px-3 py-2 text-sm font-medium border-t-4 sm:border-l-4 sm:border-t-0 flex-1"
        to="/admin/verification">
        <!-- <Repeat class=" text-primary-500 lg:mr-3 flex-shrink-0 h-6 w-6" /> -->
        <span class="hidden hide-nav-item">Verification</span>
      </Link>

      <Link
        title="New"
        class="{$location.pathname === '/admin/approved'
          ? 'bg-primary-50 border-primary-600 text-primary-600'
          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}  group flex justify-center lg:!justify-start items-center px-3 py-2 text-sm font-medium border-t-4 sm:border-l-4 sm:border-t-0 flex-1"
        to="/admin/approved">
        <!-- <Repeat class=" text-primary-500 lg:mr-3 flex-shrink-0 h-6 w-6" /> -->
        <span class="hidden hide-nav-item">Approved</span>
      </Link>

      <Link
        title="New"
        class="{$location.pathname === '/admin/pre-payment'
          ? 'bg-primary-50 border-primary-600 text-primary-600'
          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}  group flex justify-center lg:!justify-start items-center px-3 py-2 text-sm font-medium border-t-4 sm:border-l-4 sm:border-t-0 flex-1"
        to="/admin/pre-payment">
        <!-- <Repeat class=" text-primary-500 lg:mr-3 flex-shrink-0 h-6 w-6" /> -->
        <span class="hidden hide-nav-item">Pre-payment</span>
      </Link>

      <Link
        title="New"
        class="{$location.pathname === '/admin/paid'
          ? 'bg-primary-50 border-primary-600 text-primary-600'
          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}  group flex justify-center lg:!justify-start items-center px-3 py-2 text-sm font-medium border-t-4 sm:border-l-4 sm:border-t-0 flex-1"
        to="/admin/paid">
        <!-- <Repeat class=" text-primary-500 lg:mr-3 flex-shrink-0 h-6 w-6" /> -->
        <span class="hidden hide-nav-item">Paid</span>
      </Link>

      <Link
        title="New"
        class="{$location.pathname === '/admin/rejected'
          ? 'bg-primary-50 border-primary-600 text-primary-600'
          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}  group flex justify-center lg:!justify-start items-center px-3 py-2 text-sm font-medium border-t-4 sm:border-l-4 sm:border-t-0 flex-1"
        to="/admin/rejected">
        <!-- <Repeat class=" text-primary-500 lg:mr-3 flex-shrink-0 h-6 w-6" /> -->
        <span class="hidden hide-nav-item">Rejected</span>
      </Link>

      <Link
        title="New"
        class="{$location.pathname === '/admin/incomplete'
          ? 'bg-primary-50 border-primary-600 text-primary-600'
          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}  group flex justify-center lg:!justify-start items-center px-3 py-2 text-sm font-medium border-t-4 sm:border-l-4 sm:border-t-0 flex-1"
        to="/admin/incomplete">
        <!-- <Repeat class=" text-primary-500 lg:mr-3 flex-shrink-0 h-6 w-6" /> -->
        <span class="hidden hide-nav-item">Incomplete</span>
      </Link>

      <Link
        title="New"
        class="{$location.pathname === '/admin/personalinformation'
          ? 'bg-primary-50 border-primary-600 text-primary-600'
          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}  group flex justify-center lg:!justify-start items-center px-3 py-2 text-sm font-medium border-t-4 sm:border-l-4 sm:border-t-0 flex-1"
        to="/admin/personalinformation">
        <!-- <Repeat class=" text-primary-500 lg:mr-3 flex-shrink-0 h-6 w-6" /> -->
        <span class="hidden hide-nav-item">Personal information</span>
      </Link>
    </nav>
  </div>
</div>

<style lang="postcss">
  @media (max-width: 640px) {
    .nav-container {
      position: fixed;
      bottom: 0;
      flex-direction: row;
      z-index: 999;

      box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.85);

      max-width: 100%;
      width: 100%;
      margin: 0 auto;
      min-height: 50px;
      height: 50px;
    }
    .nav-items {
      flex-direction: row;
      display: flex;
      flex: 1 1 0%;
      margin-top: 0;
    }
  }

  @media (min-width: 1024px) {
    .hide-nav-item {
      display: block;
    }
  }
</style>
