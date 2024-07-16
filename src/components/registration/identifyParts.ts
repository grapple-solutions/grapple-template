export const identifyParts = async (response: any) => {
  console.log(response);

  let URL = `${process.env.SVELTE_APP_REMOTE_URL}/api`;

  const partNames =
    response?.MQ440 && response?.MQ440?.columns
      ? response.MQ440.columns?.[0]?.values
          .map((column: any) => column?.value)
          .filter((value: string) => value?.includes("MQ440"))
      : [];

  console.log({ partNames });

  // 'http://localhost:3000/api/parts?filter={"where"%3A{"key"%3A{"like"%3A"%Q44030%"}}%2C"limit"%3A10}';

  const rawPartsData = await fetch(`${URL}/parts`);
  const parts = await rawPartsData.json();

  let partsFound: any = [];

  for (let k = 0; k < parts.length; k++) {
    for (let i = 0; i < partNames.length; i++) {
      if (partNames[i].includes(parts[k].key)) {
        partsFound.push(parts[k]);
        i = partNames.length;
      }
    }
  }

  return {
    partsId: partsFound.map((part: any) => part.id),
    partsIdentified: partNames,
    partsCount: response?.["Quantity of items with MQ440 in their name"]?.value,
  };
};
