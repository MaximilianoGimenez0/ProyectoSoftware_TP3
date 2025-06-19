// ===============================================
// IMPORTS
// ===============================================
import {
    getFiltered,
    createProject,
    updateProjectInformation,
    ChangeSepStatus,
    getProjectsComplete,
    filterUserProjects,
    getUserNextSteps
} from './Services/ProjectApi.js';

import {
    renderNextSteps,
    renderProjectListComplete
} from './Components/PresentProject.js';

import { renderGenerics } from './Components/Generic.js';

import { printStatuses, cargarUsuariosEnSelect, printUsers } from './Components/CambiarUsuario.js';

import { getUsersAsync } from './Services/Users.js';
import { getStatusesAsync } from './Services/Status.js';

import {
    mostrarFeedbackError,
    mostrarFeedbackExito
} from './Scripts/Feedback.js';
import { getAreasAsync } from './Services/Area.js';
import { getTypesAsync } from './Services/Type.js';


// ===============================================
// LOAD INICIAL
// ===============================================
document.addEventListener("DOMContentLoaded", async () => {
    // Cargar selectores para cambiar de usuario
    document.getElementById('cambiarUsuarioBtn').addEventListener('click', async () => {
        const modal = new bootstrap.Modal(document.getElementById('usuarioModal'));
        modal.show();
        const users = await getUsersAsync();
        cargarUsuariosEnSelect(users, 'userSelector');
    });

    // Cargar selects de creación de proyecto
    const types = await getTypesAsync();
    const areas = await getAreasAsync();
    renderGenerics(types, 'inputCreateProjectArea');
    renderGenerics(areas, 'inputCreateProjectType');

    // Mostrar usuario actual si está en sessionStorage
    const userDiv = document.getElementById('selectedUser');
    const nombreUsuario = sessionStorage.getItem('usuarioActualNombre');
    const rolUsuario = sessionStorage.getItem('usuarioActualRoleName');

    userDiv.textContent = nombreUsuario ? `Usuario: ${nombreUsuario} ➥ ${rolUsuario}` : "⚠️ No hay ningún usuario seleccionado";

    // Botón para abrir filtros
    document.getElementById('filtersBtn').addEventListener('click', async () => {
        const users = await getUsersAsync();
        const statuses = await getStatusesAsync();
        printUsers(users, 'filter-applicant');
        printUsers(users, 'filter-approver');
        printStatuses(statuses, 'filter-status');
    });

    // Navegación entre secciones
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('data-section');
            mostrarSeccion(id);
        });
    });

    // Mostrar landing por defecto
    mostrarSeccion('landingSection');

    // Botones internos que simulan clic en tab
    const botones = document.querySelectorAll('.btn[data-section]');
    botones.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            const section = boton.getAttribute('data-section');
            document.querySelector(`.nav-link[data-section="${section}"]`)?.click();
        });
    });

    // Evento de creación de proyecto
    document.getElementById('createProjectForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('inputCreateProjectTitle').value.trim();
        const description = document.getElementById('inputCreateProjectDescription').value.trim();
        const estimatedAmount = parseFloat(document.getElementById('inputCreateProjectEstimatedAmount').value);
        const estimatedDuration = parseFloat(document.getElementById('inputCreateProjectEstimatedDuration').value);
        const area = parseInt(document.getElementById('inputCreateProjectArea').value);
        const type = parseInt(document.getElementById('inputCreateProjectType').value);
        const user = sessionStorage.getItem('usuarioActualId');

        if (!user) {
            mostrarFeedbackError('createProjectResult', 'Debe seleccionar un usuario!');

            return;
        }

        try {
            await createProject(title, description, estimatedAmount, estimatedDuration, area, type, user);
            mostrarFeedbackExito('createProjectResult', 'Proyecto creado correctamente');
        } catch (error) {
            mostrarFeedbackError('createProjectResult', error.status + " " + error.message);
        }
    });

    // Botón para aplicar filtros
    document.getElementById('filter-btn').addEventListener('click', async () => {
        const title = document.getElementById('filter-title').value.trim();
        const status = parseInt(document.getElementById('filter-status').value);
        const applicant = parseInt(document.getElementById('filter-applicant').value);
        const approvalUser = parseInt(document.getElementById('filter-approver').value);
        const checkBoxValue = document.getElementById('filter-check').checked;

        const filters = {
            title: title || null,
            status: Number.isInteger(status) ? status : null,
            applicant: Number.isInteger(applicant) ? applicant : null,
            approvalUser: Number.isInteger(approvalUser) ? approvalUser : null
        };

        try {
            const baseProjects = await getFiltered(filters);
            const fullProjects = await getProjectsComplete(baseProjects);

            if (checkBoxValue) {
                const userId = parseInt(sessionStorage.getItem('usuarioActualId'));
                const userRole = parseInt(sessionStorage.getItem('usuarioActualRole'));
                if (!userId) {
                    mostrarFeedbackError('buscar-proyectos-feedback', 'No se ha seleccionado un usuario');
                    return;
                }

                const filtered = filterUserProjects(fullProjects, userId, userRole);

                if (filtered.length < 1) {
                    mostrarFeedbackError('buscar-proyectos-feedback', 'No se encontraron proyectos con los parametros seleccionados');
                    renderProjectListComplete(filtered, 'project-list-filtered-container');
                    return;
                }

                mostrarFeedbackExito('buscar-proyectos-feedback', 'Proyectos cargados correctamente');
                renderProjectListComplete(filtered, 'project-list-filtered-container');

            } else {
                if (fullProjects.length < 1) {
                    mostrarFeedbackError('buscar-proyectos-feedback', 'No se encontraron proyectos');
                }
                mostrarFeedbackExito('buscar-proyectos-feedback', 'Proyectos cargados correctamente');
                renderProjectListComplete(fullProjects, 'project-list-filtered-container');
            }
        } catch (error) {
            mostrarFeedbackError('buscar-proyectos-feedback', error.message);
        }
    });

    // Botón para refrescar pasos
    document.getElementById('refrescarPasosBtn').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarFeedbackExito('stepDecisionResult', 'Pasos actualizados correctamente');
        document.querySelector('a.nav-link[data-section="pasoProyectoSection"]').click();

    });
});


// ===============================================
// FUNCIONES GLOBALES
// ===============================================

// Mostrar/Ocultar secciones
function mostrarSeccion(id) {
    document.querySelectorAll('main section').forEach(sec => sec.classList.add('d-none'));
    document.getElementById(id)?.classList.remove('d-none');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`.nav-link[data-section="${id}"]`)?.classList.add('active');
}


// ===============================================
// GUARDAR USUARIO SELECCIONADO
// ===============================================
document.getElementById('seleccionarUsuarioBtn').addEventListener('click', () => {
    const selector = document.getElementById('userSelector');
    const selectedId = selector.value;
    const selectedOption = selector.options[selector.selectedIndex];

    if (!selectedId) {
        mostrarFeedbackError('seleccionar-usuario-feedback', "Debe seleccionar un usuario");
        return;
    }

    sessionStorage.setItem('usuarioActualId', selectedId);
    sessionStorage.setItem('usuarioActualNombre', selectedOption.dataset.name);
    sessionStorage.setItem('usuarioActualEmail', selectedOption.dataset.email);
    sessionStorage.setItem('usuarioActualRole', selectedOption.dataset.role);
    sessionStorage.setItem('usuarioActualRoleName', selectedOption.dataset.roleName);

    mostrarFeedbackExito('seleccionar-usuario-feedback', "Usuario seleccionado correctamente");
    //bootstrap.Modal.getInstance(document.getElementById('usuarioModal')).hide();

    const userDiv = document.getElementById('selectedUser');
    userDiv.textContent = `Usuario: ${selectedOption.dataset.name} ➥ ${selectedOption.dataset.roleName}`;

    console.log('Usuario seleccionado: ', selectedOption.dataset.name, selectedOption.dataset.email, selectedOption.dataset.roleName);
});


// ===============================================
// GUARDAR CAMBIOS EN PROYECTO DESDE CARDS
// ===============================================
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-save')) {
        const card = e.target.closest('.card-body');
        const id = card.dataset.id;
        const title = card.querySelector('[name="title"]').value;
        const description = card.querySelector('[name="description"]').value;
        const duration = parseInt(card.querySelector('[name="duration"]').value);

        try {
            await updateProjectInformation(id, title, description, duration);
            mostrarFeedbackExito("buscar-proyectos-feedback", 'Proyecto modificado correctamente');
        } catch (error) {
            mostrarFeedbackError("buscar-proyectos-feedback", error.message);
        }
    }
});


// ===============================================
// MOSTRAR PASOS PENDIENTES DEL USUARIO
// ===============================================
document.getElementById('step-results-link').addEventListener('click', async (e) => {
    e.preventDefault();
    const userRole = parseInt(sessionStorage.getItem('usuarioActualRole'));
    if (!userRole) {
        mostrarFeedbackError("aprobar-proyectos-feedback", 'Usuario no seleccionado');
        return;
    }

    const steps = await getUserNextSteps(userRole);
    if (steps.length < 1) {

        mostrarFeedbackError('aprobar-proyectos-feedback', 'No hay pasos para este usuario');
    }

    renderNextSteps(steps, 'step-results');
});


// ===============================================
// DECISIÓN DE PASO (Modal)
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', async event => {
        if (event.target.closest('.open-decision-modal')) {
            const button = event.target.closest('.open-decision-modal');
            const stepId = button.dataset.stepId;
            const userId = sessionStorage.getItem('usuarioActualId');
            const projectId = button.dataset.projectId;

            document.getElementById('modalStepId').value = stepId;
            document.getElementById('modalUserId').value = userId;
            document.getElementById('modalStepProjectId').value = projectId;

            const statuses = await getStatusesAsync();
            printStatuses(statuses, 'modal-stepDecision-status-selector');

            new bootstrap.Modal(document.getElementById('decidirModal')).show();
        }
    });

    document.getElementById('confirmDecisionBtn').addEventListener('click', async () => {
        const projectId = document.getElementById('modalStepProjectId').value;
        const stepId = document.getElementById('modalStepId').value;
        const userId = document.getElementById('modalUserId').value;
        const statusId = document.getElementById('modal-stepDecision-status-selector').value;
        const observations = document.getElementById('modalObservations').value;

        if (!projectId || !stepId || !userId || !statusId || !observations.trim()) {
            mostrarFeedbackError('decidir-modal-feedback', 'Todos los campos deben completarse');
            document.getElementById('modalObservations').value = '';
            return;
        }

        try {
            await ChangeSepStatus(projectId, stepId, userId, statusId, observations);
            document.documentElement.scrollIntoView({ behavior: 'smooth' });
            mostrarFeedbackExito('stepDecisionResult', 'Paso correctamente modificado');
        } catch (error) {
            mostrarFeedbackError('stepDecisionResult', error);
        }

        bootstrap.Modal.getInstance(document.getElementById('decidirModal')).hide();
        document.getElementById('modalObservations').value = '';
    });
});
