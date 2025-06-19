function crearAlerta(divId, message, tipo = 'success') {
    const container = document.getElementById(divId);
    if (!container) return;

    // Crear el div de alerta
    const alertDiv = document.createElement('div');
    const iconClass = tipo === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger';
    const alertClass = tipo === 'success' ? 'alert-success border-success-subtle' : 'alert-danger border-danger-subtle';
    const strongText = tipo === 'success' ? 'Éxito:' : 'Error:';

    alertDiv.className = `alert alert-dismissible fade show shadow-lg border-2 ${alertClass} custom-feedback-${tipo}`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${iconClass} me-2 fs-4"></i>
            <div class="flex-grow-1">
                <strong>${strongText}</strong> ${message}
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    // Hacer scroll hasta el contenedor para que se vea la alerta
    window.scrollTo({ top: 0, behavior: 'smooth' });


    // Mostrar el contenedor y agregar la alerta
    container.classList.remove('d-none');
    container.appendChild(alertDiv);

    // Manejar el cierre con evento antes de llamar a close()
    alertDiv.addEventListener('closed.bs.alert', () => {
        alertDiv.remove();
        if (container.children.length === 0) {
            container.classList.add('d-none');
        }
    });

    // Autocerrar después de 3 segundos
    setTimeout(() => {
        const bsAlert = bootstrap.Alert.getOrCreateInstance(alertDiv);
        bsAlert.close();
    }, 4000);
}


export function mostrarFeedbackExito(divId, message) {
    crearAlerta(divId, message, 'success');
}

export function mostrarFeedbackError(divId, message) {
    crearAlerta(divId, message, 'error');
}
