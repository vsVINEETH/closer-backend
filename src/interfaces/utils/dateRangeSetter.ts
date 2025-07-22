import { Filter, DateRange } from "../../../types/express";

export function dateRangeSetter(filterConstraints: Filter): DateRange{
    try {
      const startOfYear = new Date(new Date('2024').getFullYear(), 0, 1); // January 1st of current year
      const startDate = filterConstraints.startDate ? new Date(filterConstraints.startDate) : startOfYear;
      const endDate = filterConstraints.endDate ? new Date(filterConstraints.endDate) : new Date();

      return {startDate, endDate}
    } catch (error) {
       throw new Error('Something happend in dateRangeSetter')
    }
}