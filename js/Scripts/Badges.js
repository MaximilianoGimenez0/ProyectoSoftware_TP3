//Devuelve la clase de la badge dependiendo del estado
export function getStatusColor(status) {
    switch (status) {
      case 1:
        return 'pending';
      case 2:
        return 'approved';
      case 3:
        return 'rejected';
      case 4:
        return 'observed';
      default:
        return 'dark';
    }
  }
  