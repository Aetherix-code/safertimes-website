import { cities } from "~/data/cities"
export default defineCachedEventHandler(async () => {
    return { cities };
},
    {
        maxAge: 60 * 60 * 24, // Cache for 24 hours
    })