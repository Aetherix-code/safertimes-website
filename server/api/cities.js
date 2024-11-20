export default defineCachedEventHandler(async (event) => {
    const db = event.context.mongo;
    const collection = db.collection('sirens');

    let cities = getQuery(event).cities;
    if (cities && !Array.isArray(cities) && cities) {
        cities = [cities];
    }

    try {
        let query = {};
        if (cities) {
            query = { 'siren.data': { '$in': cities } };
        }
        const docs = await collection.find(query, { projection: { 'siren.time': 1, 'siren.date': 1 } }).sort({ 'date': '-1' }).toArray();
        const entries = docs.map(entry => entry.siren.time);
        let firstDate = null;
        if (entries.length) {
            const lastEntry = docs[docs.length - 1];
            firstDate = lastEntry.siren.date.replace(/\./g, '/');
        }
        return { entries, firstDate };
    } catch (e) {
        console.error(e);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to get data'
        })
    }
},
{
    maxAge: 60 * 60 * 8, // Cache for 8 hours
    getKey: (event) => {
        const query = getQuery(event);

        // Create a unique cache key based on query params
        return JSON.stringify(query);
    },
})