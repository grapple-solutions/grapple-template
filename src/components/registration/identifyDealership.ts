import Fuse from "fuse.js";

export const identifyDealership = async (
  rawDealershipInfo: string,
  dealershipInfo: string,
  dealershipName: string
) => {
  console.log(dealershipInfo);

  let backEndUrl = `${process.env.SVELTE_APP_REMOTE_URL}/api`;

  let dealership = [];
  let zipCode = dealershipInfo?.match(/\d{5}/)?.[0];

  if (zipCode) {
    const dealershipRequest = await fetch(
      `${backEndUrl}/dealerships?filter={"where":{"plz":{"like":"${zipCode}"}}}`
    );
    dealership = await dealershipRequest.json();
  }

  if (dealership.length > 1) {
    // (1) If not unique by zip code, filter by name
    // need to narrow down possible dealerships
    const fuse = new Fuse(
      dealership.map((d: any) => d.name),
      {
        includeScore: true,
      }
    );
    const rankedSearch = fuse.search(dealershipName);
    return dealership[rankedSearch[0]?.refIndex];
  } else if (dealership.length === 1) {
    // (2) If unique by zip code, return value
    return dealership[0];
  } else {
    // (3) If not found by zip code, find by name
    const dealershipRequestWithNameFilter = await fetch(
      `${backEndUrl}/dealerships?filter={"where":{"name":{"like":"%25${dealershipName}%25"}}}`
    );
    const dealershipWithNameFilter =
      await dealershipRequestWithNameFilter.json();

    if (dealershipWithNameFilter.length == 1) {
      // (4) If unique by name, return value
      return dealershipWithNameFilter[0];
    } else if (dealershipWithNameFilter.length > 1) {
      // (5) If not unique by name, find by city name (ort)
      const dividedInfo = rawDealershipInfo?.split(",");
      const cityName = `${dividedInfo[1]}${dividedInfo[2]}`;
      const foundDealer = dealershipWithNameFilter.find((d: any) => {
        if (cityName?.includes(d.ort)) return d;
      });
      return foundDealer;
    }
  }
};
