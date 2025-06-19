/**
 * Devuelve la lista de status desde caché, sessionStorage o la API.
 */


let cachedStatuses = null;

export async function getStatusesAsync() {
    if (cachedStatuses) return cachedStatuses;

    const stored = sessionStorage.getItem('statuses');
    if (stored) {
        cachedStatuses = JSON.parse(stored);
        return cachedStatuses;
    }

    const url = "https://localhost:7160/api/ApprovalStatus";

    try {
        const response = await fetch(url);

        const data = await response.json();

        if (response.ok) {
            console.log('Estatus encontrados: ', data);

            cachedStatuses = data;
            sessionStorage.setItem('statuses', JSON.stringify(data));

            return cachedStatuses;
        }

        const error = new Error(data.message || `Error ${response.status}`);
        error.status = response.status;
        throw error;

    } catch (error) {
        console.error("API Error (StatusService -> getUsers, error: )", error);
        throw error;
    }
}
