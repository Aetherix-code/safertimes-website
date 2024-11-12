import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
    const client = new MongoClient(process.env.MONGO_URL);
    const collection = client.db('saferTimes').collection('sirens');

    let cities = getQuery(event).cities;
    if (cities && !Array.isArray(cities) && cities) {
        cities = [cities];
    }

    console.log(cities);

    // console.error(e);
    console.log('Using offline version...');

    try {
        let query = {};
        if (cities) {
            query = {'siren.data': {'$in': cities}};
        }
        const docs = await collection.find(query).sort({'date': '-1'}).toArray();
        client.close();
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
})