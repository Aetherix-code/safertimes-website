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
        // Calculate the date 3 months ago from now
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 6);

        // Add alertDate filter to the query
        query['siren.alertDate'] = { $gt: threeMonthsAgo.toISOString() };

        console.log('Query:', query);

        const docs = await collection.find(query, { projection: { 'siren.time': 1, 'siren.date': 1, 'siren.alertDate': 1 } }).sort({ 'date': '-1' }).toArray();
        const entries = docs.map(entry => entry.siren.time);
        console.log('Docs', docs);
        let firstDate = null;
        let earliestDate = null;
        if (entries.length) {
            const lastEntry = docs[docs.length - 1];
            firstDate = lastEntry.siren.date.replace(/\./g, '/');
            earliestDate = docs[0].siren.date.replace(/\./g, '/');
        }
        console.log('First date:', firstDate);
        console.log('Earliest date:', earliestDate);
        return { entries, firstDate, earliestDate };
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
            const queryString = JSON.stringify(query);
            const encodedKey = Buffer.from(queryString).toString('base64');
            return encodedKey;
        }
    })