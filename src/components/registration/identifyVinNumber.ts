import { isValid } from "@cloud20x/vin-decoder";

export const identifyVinNumber = (vinNumber: any) => {
  if (!vinNumber) 
    return null;

  let sanitizedVin = vinNumber.replace("WIN", "W1N");
  
  sanitizedVin = sanitizedVin.replaceAll(/[^a-zA-Z0-9]/g, "");
  sanitizedVin = sanitizedVin.slice(0, 17);

  console.log({ vinNumber, sanitizedVin });

  if(!isValid(sanitizedVin)) 
    return null;

  return sanitizedVin;
};
