export const useFiltersPersons = () => {

    const getField = (value) => value == 'true' ? 'Sí' : 'No';

    const listKeys = {
        name__unaccent__icontains: {
            name: 'Nombre'
        },
        prefix__unaccent__icontains: {
            name: 'Prefijo'
        },
        is_automatic: {
            name: '¿Automático?',
            get: getField
        },
        is_collaborator: {
            name: '¿Colaborador?',
            get: getField
        },
        is_assignable: {
            name: '¿Asignable?',
            get: getField
        },
        is_active: {
            name: 'Estatus',
            get: e => e == 'all' ? 'Todos'
                : e == 'true' ? 'Activo' : 'Inactivo'
        },
    }

    return {
        listKeys
    }
}