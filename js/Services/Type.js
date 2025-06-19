/**
 * Devuelve la lista de tipos desde caché, sessionStorage o la API.
 */


let cachedTypes = null;

export async function getTypesAsync() {
    if (cachedTypes) { return cachedTypes; }

    const stored = sessionStorage.getItem('types');
    if (stored) {
        cachedTypes = JSON.parse(stored);
        return cachedTypes;
    }

    const url = "https://localhost:7160/api/ProjectType";

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            console.log('Tipos encontrados: ', data);
            cachedTypes = data;
            sessionStorage.setItem('types', JSON.stringify(data));
            return data;
        }

        const error = new Error(data.message || `Error ${response.status}`);
        error.status = response.status;
        throw error;

    } catch (error) {
        console.error("API Error (TypeService -> getTypesAsync, error: )", error);
        throw error;
    }
}
