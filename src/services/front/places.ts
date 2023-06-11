import request from "request-promise";

export const getPlaces = async (query: string) => {
    try {
        if (!query) {
            return;
        }
        const key = 'AIzaSyCCF86YAE2QgYGeHiFnA8bt2rucr4w4urE';
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?input=${query}&fields=formatted_address,name,geometry&key=${key}`;
        const response = await request(url);
        const res = JSON.parse(response);

        res.results.map((adr: any) => {
            // adr.name = `${query} - ${adr.formatted_address}`;
            adr.text = adr.name;
            adr.id = adr.formatted_address;
            // adr.query = query;
            return adr;
        });

        return res.results;
    } catch (error) {
        console.error('========================= Begin Error getPlaces =============================')
        console.error(error)
        console.error('========================= END Error getPlaces =============================')
    }

};
