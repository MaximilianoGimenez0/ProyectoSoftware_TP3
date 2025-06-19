let cachedAreas = null;

/**
 * Devuelve la lista de areas desde caché, sessionStorage o la API.
 */

export async function getAreasAsync() {
    if(cachedAreas){return cachedAreas;}

    const stored = sessionStorage.getItem('areas');
    if(stored){
        cachedAreas = JSON.parse(stored);
        return cachedAreas;
    }

    const url = "https://localhost:7160/api/Area";

    try{
        const response = await fetch(url);
        const data = await response.json();

        if(response.ok){
            console.log('Areas encontradas: ',data);
            cachedAreas = data;
            sessionStorage.setItem('areas',JSON.stringify(data));
            return data;
        }

        const error = new Error(data.message || `Error ${response.status}`);
        error.status = response.status;
        throw error;

    }catch(error){
        console.error("API Error (AreaService -> getAreasAsync, error: )", error);
        throw error;
    }
}
