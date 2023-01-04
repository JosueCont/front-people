import { useSelector } from "react-redux";

export const useFiltersCandidate = () =>{

    const {
        list_states,
        load_states,
        list_main_categories,
        load_main_categories
    } = useSelector(state => state.jobBankStore);

    const listKeys = {
        fisrt_name__unaccent__icontains: 'Nombre',
        last_name__unaccent__icontains: 'Apellidos',
        email__unaccent__icontains: 'Correo',
        cell_phone: 'Teléfono',
        job: 'Puesto',
        is_active: 'Estatus',
        area: 'Especialización',
        other_area: 'Otra especialización',
        state: 'Estado',
        municipality__unaccent__icontains: 'Municipio'
    }

    const getArea = (id) =>{
        if(!id) return id;
        const find_ = item => item.id == id;
        let result = list_main_categories.find(find_);
        if(!result) return id;
        return result.name;
    }

    const getState = (id) =>{
        if(!id) return id;
        const find_ = item => item.id == id;
        let result = list_states.find(find_);
        if(!result) return id;
        return result.name;
    }

    const getStatus = (value) =>{
        return value == 'true' ? 'Activo' : 'Inactivo';
    }

    const listGets = {
        area: getArea,
        state: getState,
        is_active: getStatus
    }

    return { listKeys, listGets };

}