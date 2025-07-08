import { FormattedLocation } from "../../../types/express"
export interface IGeolocation {
    GetLocation(latitude: string, longitude: string):Promise<FormattedLocation | null>
};