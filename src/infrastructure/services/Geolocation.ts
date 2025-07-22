import { IGeolocation } from "../../usecases/interfaces/IGeolocation";
import { FormattedLocation } from "../../../types/express";

export class Geolocation implements IGeolocation {

    async GetLocation (latitude: string, longitude: string):Promise<FormattedLocation | null>{
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        
        if(response.ok){
         let data = await response.json()
         const address = data.address;
         const formattedLocation = { 
            latitude,
            longitude,
            city: address.city || address.town || address.village || "Unknown",
            state: address.state || "Unknown",
            country: address.country || "Unknown",
          };
          return formattedLocation
        }
        return null;
    };
};
