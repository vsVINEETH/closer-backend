import { DOBRange, Preferences } from "../../../types/express";

export function dobRangeFinder (userPreferences: Preferences): DOBRange {
    try {
        const currentYear = new Date().getFullYear();
        let minDob;
        let maxDob;
        if (Array.isArray(userPreferences.ageRange) && userPreferences.ageRange.length === 2) {
        const [minAge, maxAge] = userPreferences.ageRange.map(Number);
        minDob = new Date(currentYear - maxAge, 0, 1);
        maxDob = new Date(currentYear - minAge, 11, 31);
        };

        return {minDob, maxDob}
    } catch (error) {
        throw new Error('Something happend in dobRangeFinder')
    };
};