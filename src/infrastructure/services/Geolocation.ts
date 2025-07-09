import { IGeolocation } from "../../usecases/interfaces/IGeolocation";
import { FormattedLocation } from "../../../types/express";
import { NextFunction, Request, response, Response } from "express";

export const getLocation = async (req: Request, res: Response, next: NextFunction) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${req.query.latitude}&lon=${req.query.longitude}&format=json`);

        if(response.ok){
         let data = await response.json()
         console.log(data);
         const address = data.address;
         const formattedLocation = { 
            latitude: req.query.latitude,
            longitude: req.query.longitude,
            city: address.city || address.town || address.village || "Unknown",
            state: address.state || "Unknown",
            country: address.country || "Unknown",
          };
          console.log(formattedLocation);
        }
    
    return
};

export class Geolocation implements IGeolocation {

    async GetLocation (latitude: string, longitude: string):Promise<FormattedLocation | null>{
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);

        console.log(response.status)
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