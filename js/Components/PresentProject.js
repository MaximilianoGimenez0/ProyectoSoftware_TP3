import { getStatusColor } from "../Scripts/Badges.js";

const opciones = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
};

export function renderProjectListComplete(projects, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(projects)) return;

  container.innerHTML = `
    <div class="row">
      ${projects.map(project => `
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm rounded-4 h-100 border-0">
          
            <div class="container mt-3">
            <h2>
              <span class="p-2 shadow-sm rounded-4 badge bg-${getStatusColor(project.status.id)} ms-2">${project.status.name}</span>
            </h2>

            </div>
            <div class="card-body" data-id="${project.id}">
              
              <div class="row">
  <div class="col">
    <p class="mb-1 fw-semibold d-flex align-items-center gap-2" style="font-size: 1.05rem;">
      <i class="bi bi-pencil-square text-muted"></i> Título
    </p>
    <input class="form-control mb-2" name="title" value="${project.title}">
  </div>

  <div class="col mb-3">
    <p class="mb-1 fw-semibold d-flex align-items-center gap-2" style="font-size: 1.05rem;">
      <i class="bi bi-pencil-square text-muted"></i> Descripción
    </p>
    <input class="form-control" name="description" value="${project.description}">
  </div>

  <div class="col mb-3">
    <p class="mb-1 fw-semibold d-flex align-items-center gap-2" style="font-size: 1.05rem;">
      <i class="bi bi-pencil-square text-muted"></i> Duración
    </p>
    <input class="form-control" type="number" name="duration" value="${project.duration}">
  </div>
</div>

<button class="btn btn-success btn-save">
  <i class="bi bi-save me-2"></i> Guardar cambios
</button>


              <hr>

              <div class="row">
               
                <div class="col mb-3">
                  <p class="mb-1 fw-semibold" style="font-size: 1.05rem;">Área</p>
                  <p class="text-muted">${project.area.name}</p>
                </div>

                <div class="col mb-3">
                  <p class="mb-1 fw-semibold" style="font-size: 1.05rem;">Tipo</p>
                  <p class="text-muted">${project.type.name}</p>
                </div>
              </div>
           
              <hr>

              <div class="row">
                <div class="col mb-3">
                  <p class="mb-1 fw-semibold" style="font-size: 1.05rem;">Usuario creador</p>
                  <p class="mb-0">${project.user.name}</p>
                  <p class="text-muted">${project.user.email}</p>
                </div>

                <div class="col mb-3">
                  <p class="mb-1 fw-semibold" style="font-size: 1.05rem;">Rol</p>
                  <p class="text-muted">${project.user.role.name}</p>
                </div>
              </div>

              ${project.steps?.length > 0 ? `
                <hr>
                <h5 class="fw-semibold mb-3" style="font-size: 1.2rem;">Pasos</h5>

                <div class="accordion" id="stepsAccordion${project.id}">
                  ${project.steps.map((step, i) => `
                    <div class="accordion-item border-0 mb-2 rounded-3 shadow-sm">
                      <h2 class="accordion-header" id="heading${project.id}_${i}">
                        <button class="accordion-button collapsed rounded-3" type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse${project.id}_${i}"
                          aria-expanded="false"
                          aria-controls="collapse${project.id}_${i}"
                          style="font-size: 1rem;">
                          Paso ${step.stepOrder} - ${step.status.name}
                        </button>
                      </h2>
                      <div id="collapse${project.id}_${i}" class="accordion-collapse collapse"
                        aria-labelledby="heading${project.id}_${i}"
                        data-bs-parent="#stepsAccordion${project.id}">
                        <div class="accordion-body">
                          <p><strong>Orden:</strong> ${step.stepOrder}</p>
                          <p><strong>Estado:</strong> ${step.status.name}</p>
                          <p><strong>Fecha de decisión:</strong> ${step.decisionDate ? new Date(step.decisionDate).toLocaleString('es-AR',opciones).replace(',', ' -') : 'Sin decisión'}</p>
                          <p><strong>Aprobador:</strong> ${step.approverUser?.name || 'No aprobado'} (${step.approverUser?.email || 'N/A'})</p>
                          <p><strong>Rol del aprobador:</strong> ${step.approverRole.name}</p>
                          <p><strong>Observaciones:</strong> ${step.observations || 'No hay observaciones'}</p>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div> <!-- .card-body -->
          </div> <!-- .card -->
        </div> <!-- .col -->
      `).join('')}
    </div>
  `;
}


export function renderNextSteps(steps, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(steps)) return;

  container.innerHTML = `
    <div class="row">
      ${steps.map(project => `
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm rounded-4 h-100 border-0">
          
            <div class="container mt-3">
              <h2>
                <span class="p-2 shadow-sm rounded-4 badge bg-${getStatusColor(project.status.id)} ms-2">
                  ${project.status.name}
                </span>
              </h2>
            </div>

            <div class="card-body" data-id="${project.id}">
              <div class="row">
                <div class="col">
                  <p class="mb-1 fw-semibold d-flex align-items-center gap-2" style="font-size: 1.05rem;">
                    <i class="bi bi-pencil-square text-muted"></i> Título
                  </p>
                  <input class="form-control mb-2" name="title" value="${project.title}" readonly>
                </div>

                <div class="col mb-3">
                  <p class="mb-1 fw-semibold d-flex align-items-center gap-2" style="font-size: 1.05rem;">
                    <i class="bi bi-pencil-square text-muted"></i> Descripción
                  </p>
                  <input class="form-control" name="description" value="${project.description}" readonly>
                </div>

                <div class="col mb-3">
                  <p class="mb-1 fw-semibold d-flex align-items-center gap-2" style="font-size: 1.05rem;">
                    <i class="bi bi-pencil-square text-muted"></i> Duración
                  </p>
                  <input class="form-control" type="number" name="duration" value="${project.duration}" readonly>
                </div>
              </div>

              <hr>

              <div class="row">
              
                <div class="col mb-3">
                  <p class="mb-1 fw-semibold" style="font-size: 1.05rem;">Área</p>
                  <p class="text-muted">${project.area.name}</p>
                </div>

                <div class="col mb-3">
                  <p class="mb-1 fw-semibold" style="font-size: 1.05rem;">Tipo</p>
                  <p class="text-muted">${project.type.name}</p>
                </div>
              
                          
               <div class="col mb-3">
                  <p class="mb-1 fw-semibold" style="font-size: 1.05rem;">Usuario creador</p>
                  <p class="mb-0">${project.user.name}</p>
                  <p class="text-muted">${project.user.email}</p>
                </div>

                <div class="col mb-3">
                  <p class="mb-1 fw-semibold" style="font-size: 1.05rem;">Rol</p>
                  <p class="text-muted">${project.user.role.name}</p>
                </div>
              </div>

              <hr>
              
              <div class="row align-items-center">
                
                <div class="p-3 col-4">
                  <h5 class="fw-semibold">PASO PENDIENTE</h5>
                </div>
                <div class="col-4">
                  <span class="p-2 shadow-sm rounded-4 badge bg-${getStatusColor(project.step.status.id)} ms-2">
                      ${project.step.status.name}
                  </span>
                </div>

                <div class="col-4">
                  <button class="btn btn-success open-decision-modal" data-step-id="${project.step.id}" data-project-id="${project.id}" type="button">
                    <i class="bi bi-save me-2"></i> Decidir
                  </button>
                </div>

              </div>
              
              <div class="step-card mb-3 p-3 border rounded-3 shadow-sm bg-light">
                <h6 class="fw-bold mb-2">
                  Paso ${project.step.stepOrder}
                </h6>
                
                <p><strong>Fecha de decisión:</strong> ${project.step?.decisionDate ? new Date(project.step.decisionDate).toLocaleDateString() : 'Sin decisión'}</p>
                <p><strong>Aprobador:</strong> ${project.step?.approverUser?.name || 'No aprobado'} (${project.step?.approverUser?.email || 'N/A'})</p>
                <p><strong>Rol del aprobador:</strong> ${project.step?.approverRole.name}</p>
                <p><strong>Observaciones:</strong> ${project.step?.observations || 'No hay observaciones'}</p>
              </div>

            </div> 
          </div> 
        </div> 
      `).join('')}
    </div>
  `;
}
