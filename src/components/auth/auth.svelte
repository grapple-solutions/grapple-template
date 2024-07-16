<script>
  import { _ } from "svelte-i18n";

  import Logo from "../../assets/icons/logo.svg.svelte";

  let username = "";
  let password = "";
  let loginFaild = false;
  const login = () => {
    console.log("log in button pressed");

    if (
      username == process.env.SVELTE_APP_USERNAME &&
      password == process.env.SVELTE_APP_PASSWORD
    ) {
      console.log("login successful");
      // set auth to true in localstorage
      localStorage.setItem("auth", true);
      window.location.href = "/admin";
    } else {
      console.log("login failed");
      loginFaild = true;
    }
  };
</script>

<div class="min-h-full pt-16 pb-12 flex flex-col bg-white">
  <main
    class="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8"
  >
    <!-- username and password field centered in a div -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 ">
        <div class="flex-shrink-0 flex justify-center">
          <a href="/" class="inline-flex">
            <span class="sr-only">MBD</span>
            <Logo />
          </a>
        </div>
        <h2
          class="mt-6 text-center text-3xl font-extrabold text-gray-900 font-CorpoA-Bold"
        >
          {$_("Sign in to your Admin account")}
        </h2>

        <form class="mt-8 space y-6" on:submit|preventDefault={login}>
          <div class="rounded-md shadow-sm -space-y-px flex  flex-col !gap-4">
            <div>
              <label for="username" class="sr-only">
                {$_("Username")}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autocomplete="username"
                required
                bind:value={username}
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm font-CorpoS"
                placeholder="Username"
              />
            </div>
            <div>
              <label for="password" class="sr-only"> {$_("Password")} </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                bind:value={password}
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm font-CorpoS"
                placeholder="Password"
              />
            </div>

            <!-- submit button -->
            <div>
              <button
                type="submit"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-CorpoS-Bold"
              >
                {$_("Sign in")}
              </button>
            </div>
          </div>
          <!-- login failed message -->
          {#if loginFaild}
            <div class="text-red-500 text-center mt-4">
              <p>
                {$_("Username or Password is incorrect")}
              </p>
            </div>
          {/if}
        </form>
      </div>
    </div>
  </main>
</div>
