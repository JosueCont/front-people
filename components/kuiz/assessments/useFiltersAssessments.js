export const useFiltersAssessments = () =>{
    
    const listKeys = {
        name: 'Nombre',
        is_active: 'Estatus'
    }

    const getStatus = (value) => value == 'true'
        ? 'Activo' : 'Inactivo';

    const listGets = {
        is_active: getStatus
    }

    return {
        listKeys,
        listGets
    }

}