//Pintar un genérico
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

//Pintar estados
export function printStatuses(data, output) {

    const selector = document.getElementById(output);
    selector.innerHTML = '<option value="null" selected>Seleccionar...</option>';
  
    data.forEach(status => {
      const option = document.createElement('option');
      option.value = status.id;
      option.textContent = `${status.name}`;
      selector.appendChild(option);
    });
  }