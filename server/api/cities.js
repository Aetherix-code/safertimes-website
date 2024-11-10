export default defineEventHandler(async (event) => {
    let cities = getQuery(event).cities;
    if (!Array.isArray(cities) && cities) {
        cities = [cities];
    }

    const url = new URL('https://alerts-history.oref.org.il/Shared/Ajax/GetAlarmsHistory.aspx?lang=he&mode=3');
    let i = 0;
    for (const city of cities) {
        url.searchParams.append(`city_${i}`, city);
        i++;
    }

    console.log(url.toString());

    try {
        const response = await fetch(url);
        const json = await response.json();
        const entries = json.map(entry => entry.time);
        return entries;
    } catch (e) {
        console.log(e);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to get data'
        })
    }
})