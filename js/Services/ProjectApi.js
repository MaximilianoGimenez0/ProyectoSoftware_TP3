
//Llamada a la api para crear un proyecto
export async function createProject(title, description, estimatedAmount, estimatedDuration, area, type, user) {
  const baseUrl = "https://localhost:7160/api/project";

  const body = {
    Title: title,
    Description: description,
    EstimatedAmount: estimatedAmount,
    EstimatedDuration: estimatedDuration,
    Area: area,
    Type: type,
    CreateBy: user
  };

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json(); // respuesta del backend (ej. proyecto creado)
    if (response.ok) {
      console.log("Proyecto creado:", data);
      return data;
    }

    // Response status Code != 2xx
    const error = new Error(data.message || `Error ${response.status}`);
    error.status = response.status;
    throw error;

  } catch (error) {
    console.error("API Error (ProjectApi -> createProject, error: )", error);
    throw error;
  }
}

//Llamada a la api para filtrar proyectos
export async function getFiltered(filters = {}) {
  const baseUrl = "https://localhost:7160/api/project";
  const params = new URLSearchParams();

  // Solo agrega parametros si tienen un valor cargado
  if (filters.title?.trim()) {
    params.append("title", filters.title.trim());
  }

  if (Number.isInteger(filters.status)) {
    params.append("status", filters.status);
  }

  if (Number.isInteger(filters.applicant)) {
    params.append("applicant", filters.applicant);
  }

  if (Number.isInteger(filters.approvalUser)) {
    params.append("approvalUser", filters.approvalUser);
  }

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url);

    const data = await response.json(); //Response

    if (response.ok) {
      console.log('Resultados obtenidos: ', data);
      return data;
    }

    //Response status Code != 2xx
    const error = new Error(data.message || `Error ${response.status}`);
    error.status = response.status;
    throw error;
  }
  catch (error) {
    console.error('API Error (ProjectApi --> getFiltered, error: )', error);
    throw error;
  }
}

//Toma una lista de proyectos y devuelve esos proyectos en su formato completo, llamando por id a cada proyecto
export async function getProjectsComplete(projects) {

  const completeProjets = [];

  for (const project of projects) {
    const response = await getById(project.id);
    completeProjets.push(response);
  }

  return completeProjets;

}


//Llamada a la api para obtener proyecto por id
export async function getById(id) {
  const url = `https://localhost:7160/api/project/${id}`;

  try {
    const response = await fetch(url);

    const data = await response.json();

    if (response.ok) {
      console.log('Proyecto encontrado: ', data);
      return data;
    }

    //Response status Code != 2xx
    const error = new Error(data.message || `Error ${response.status}`);
    error.status = response.status;
    throw error;

  } catch (error) {
    console.error("API Error (ProjectApi -> getById, error: )", error);
    throw error;

  }
}


//Llamada a la api para cambiar información de un proyecto
export async function updateProjectInformation(id, title, description, estimatedDuration) {
  const url = `https://localhost:7160/api/project/${id}`;

  if (!id == null || !title?.trim() == null || !description?.trim() == null || estimatedDuration == null) {
    throw new Error('Todos los campos son obligatorios y deben tener valores válidos.');
  }

  const body = {
    title: title,
    description: description,
    duration: estimatedDuration
  };

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Proyecto modificado correctamente', data);
      return data;
    }

    // Response status Code != 2xx
    const error = new Error(data.message || `Error ${response.status}`);
    error.status = response.status;
    throw error;

  } catch (error) {
    // Errores de red o cualquier otro problema
    console.error('API Error (ProjectApi -> updateProjectInformationFunction, error: )', error);
    throw error;
  }
}


//LLamada a la api para decidir un paso
export async function ChangeSepStatus(projectId, id, user, status, observation) {
  const url = `https://localhost:7160/api/project/${projectId}/decision`;

  const body = {
    id: id,
    user: user,
    status: status,
    observation: observation
  };

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Paso modificado correctamente', data);
      return data;
    }

    // Response status Code != 2xx
    const error = new Error(data.message || `Error ${response.status}`);
    error.status = response.status;
    throw error;

  } catch (error) {
    // Errores de red o cualquier otro problema
    console.error('API Error (ProjectApi -> ChangeSepStatus, error: )', error);
    throw error;
  }
}


// Filtra los proyectos a los que pertenece un usuario
export function filterUserProjects(projects, userId, userRole) {
  let filteredProjects = [];

  for (const project of projects) {

    if (project.user.id == userId) {
      filteredProjects.push(project);
      continue;
    }

    // Por cada paso
    for (const step of project.steps) {
      const approverUserMatch = step.approverUser && step.approverUser.id === userId;
      const approverRoleMatch = step.approverRole.id === userRole;

      if (approverUserMatch || approverRoleMatch) {
        filteredProjects.push(project);
      }

    }

  }

  return filteredProjects;
}


//Devuelve los proximos pasos de aprobación de un rol
export async function getUserNextSteps(roleId) {
  const filters = {};

  let allProjects = await getFiltered(filters);
  allProjects = await getProjectsComplete(allProjects);

  let pendingProjects = allProjects.filter(p => p.status.id == 1 || p.status.id == 4);

  let nextSteps = [];

  for (const project of pendingProjects) {
    let response = {};
    // Filtro los steps
    let filteredSteps = project.steps.filter(
      step => step.status.id == 1 || step.status.id == 4
    );
    // Ordeno por stepOrder
    filteredSteps.sort((a, b) => a.stepOrder - b.stepOrder);
    // Si existe y cumple las condiciones lo agrego a la lista de steps
    let nextStep = filteredSteps[0];
    if (nextStep && nextStep.approverRole.id == roleId) {

      response.id = project.id;
      response.title = project.title;
      response.description = project.description;
      response.status = project.status;
      response.duration =project.duration;
      response.type = project.type;
      response.area = project.area;
      response.user = project.user;
      response.step = nextStep;

      nextSteps.push(response);
    }
  }

  console.log('Steps encontrados para el rol: ', nextSteps);
  return nextSteps;
}