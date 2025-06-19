export function renderGenerics(data, output) {
    const selector = document.getElementById(output);
    selector.innerHTML = '<option value="null" selected>Seleccionar...</option>';

    data.forEach(generic => {
        const option = document.createElement('option');
        option.value = generic.id;
        option.textContent = `${generic.name}`;
        selector.appendChild(option);
    });
}

