
export function cargarUsuariosEnSelect(data, output) {

  const selector = document.getElementById(output);
  selector.innerHTML = '<option value="" disabled selected>Seleccionar...</option>';

  data.forEach(user => {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = `${user.name} (${user.email}) ~ [${user.role.name}]`;

    option.dataset.email = user.email;
    option.dataset.role = user.role.id;
    option.dataset.roleName = user.role.name;
    option.dataset.name = user.name;

    selector.appendChild(option);
  });
}


export function printUsers(data, output) {

  const selector = document.getElementById(output);
  selector.innerHTML = '<option value="null" selected>Seleccionar...</option>';

  data.forEach(user => {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = `${user.name} ~ [${user.role.name}]`;
    selector.appendChild(option);
  });
}




