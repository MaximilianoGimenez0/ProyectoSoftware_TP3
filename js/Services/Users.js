/**
 * Devuelve la lista de usuarios desde caché, sessionStorage o la API.
 */


let cachedUsers = null;

export async function getUsersAsync() {
    if (cachedUsers) return cachedUsers;

    const stored = sessionStorage.getItem('users');
    if (stored) {
        cachedUsers = JSON.parse(stored);
        return cachedUsers;
    }

    const url = "https://localhost:7160/api/User";

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            console.log('Usuarios encontrados: ', data);
            cachedUsers = data;
            sessionStorage.setItem('users', JSON.stringify(data));
            return cachedUsers;
        }

        const error = new Error(data.message || `Error ${response.status}`);
        error.status = response.status;
        throw error;

    } catch (error) {
        console.error("API Error (UserService -> getUsersAsync):", error);
        throw error;
    }
}
