
export async function getAreas() {
    const url = "https://localhost:7160/api/Area";

    try{
        const response = await fetch(url);

        const data = await response.json();

        if(response.ok){
            console.log('Areas encontradas: ',data);
            return data;
        }

        const error = new Error(data.message || `Error ${response.status}`);
        error.status = response.status;
        throw error;

    }catch(error){
        console.error("API Error (informationApi -> getAreas, error: )", error);
        throw error;
    }
}


export async function getStatuses() {
    const url = "https://localhost:7160/api/ApprovalStatus";

    try{
        const response = await fetch(url);

        const data = await response.json();

        if(response.ok){
            console.log('Estados encontrados: ',data);
            return data;
        }

        const error = new Error(data.message || `Error ${response.status}`);
        error.status = response.status;
        throw error;

    }catch(error){
        console.error("API Error (informationApi -> getStatuses, error: )", error);
        throw error;
    }
}

export async function getRoles() {
    const url = "https://localhost:7160/api/Role";

    try{
        const response = await fetch(url);

        const data = await response.json();

        if(response.ok){
            console.log('Roles encontrados: ',data);
            return data;
        }

        const error = new Error(data.message || `Error ${response.status}`);
        error.status = response.status;
        throw error;

    }catch(error){
        console.error("API Error (informationApi -> getRoles, error: )", error);
        throw error;
    }
}

export async function getTypes() {
    const url = "https://localhost:7160/api/ProjectType";

    try{
        const response = await fetch(url);

        const data = await response.json();

        if(response.ok){
            console.log('Tipos encontrados: ',data);
            return data;
        }

        const error = new Error(data.message || `Error ${response.status}`);
        error.status = response.status;
        throw error;

    }catch(error){
        console.error("API Error (informationApi -> getTypes, error: )", error);
        throw error;
    }
}

export async function getUsers() {
    const url = "https://localhost:7160/api/User";

    try{
        const response = await fetch(url);

        const data = await response.json();

        if(response.ok){
            console.log('Usuarios encontrados: ',data);
            return data;
        }

        const error = new Error(data.message || `Error ${response.status}`);
        error.status = response.status;
        throw error;

    }catch(error){
        console.error("API Error (informationApi -> getUsers, error: )", error);
        throw error;
    }
}