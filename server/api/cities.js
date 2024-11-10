import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
    let cities = getQuery(event).cities;
    if (cities && !Array.isArray(cities) && cities) {
        cities = [cities];
    }

    console.log(cities);


    // const url = new URL('https://alerts-history.oref.org.il/Shared/Ajax/GetAlarmsHistory.aspx?lang=he&mode=3');
    // let i = 0;
    // for (const city of cities) {
    //     url.searchParams.append(`city_${i}`, city);
    //     i++;
    // }

    // console.log(url.toString());

    // let response;
    try {
        throw 'Failed';
        // Define headers
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
            'Referer': 'https://alerts-history.oref.org.il/12481-he/Pakar.aspx?pagemode=iframe&u1st=0',
            'X-Requested-With': 'XMLHttpRequest'
        };

        // Make fetch request with headers
        response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        const json = await response.json();
        const entries = json.map(entry => entry.time);
        return entries;
    } catch (e) {
        // console.error(e);
        console.log('Using offline version...');

        try {
            const filePath = path.resolve('data/alerts_history.json'); // adjust path as needed
            const data = await fs.readFile(filePath, 'utf-8');
            const jsonData = JSON.parse(data);
            const entries = jsonData.filter(entry => !cities || cities.includes(entry.data)).map(entry => entry.time);
            return entries;
        } catch (e) {
            console.error(e);
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to get data'
            })
        }
    }
})