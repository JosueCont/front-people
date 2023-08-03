import { useSelector } from "react-redux";

export const useFiltersCandidate = () =>{

    const {
        load_main_categories,
        list_main_categories,
        list_states,
        load_states,
        list_sectors,
        load_sectors,
        load_sub_categories,
        list_sub_categories
    } = useSelector(state => state.jobBankStore);

    const getCategory = (id) =>{
        if(!id) return id;
        const find_ = item => item.id == id;
        let result = list_main_categories.find(find_);
        if(!result) return id;
        return result.name;
    }

    const getSubCategory = (id)=>{
        if(!id) return id;
        const find_ = item => item.id == id;
        let result = list_sub_categories.find(find_);
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

    const getSector = (id) =>{
        if(!id) return id;
        const find_ = item => item.id == id;
        let result = list_sectors.find(find_);
        if(!result) return id;
        return result.name;
    }

    const getStatus = (value) =>{
        return value == 'true' ? 'Activo' : 'Inactivo';
    }

    const listKeys = {
        first_name__unaccent__icontains: {
            name: 'Nombre'
        },
        last_name__unaccent__icontains: {
            name: 'Apellidos'
        },
        email__unaccent__icontains: {
            name: 'Correo'
        },
        cell_phone: {
            name: 'Teléfono'
        },
        last_job: {
            name: 'Puesto'
        },
        is_active: {
            name: 'Estatus',
            get: getStatus
        },
        main_category: {
            name: 'Categoría',
            get: getCategory,
            loading: load_main_categories
        },
        sector: {
            name: 'Sector',
            get: getSector,
            loading: load_sectors
        },
        state: {
            name: 'Estado',
            get: getState,
            loading: load_states
        },
        municipality__unaccent__icontains: {
            name: 'Municipio'
        },
        sub_category: {
            name: 'Subcategoría',
            get: getSubCategory,
            loading: load_sub_categories
        },
        age_start: {
            name: 'Edad mínima'
        },
        age_end: {
            name: 'Edad máxima'
        }
    }

    return { listKeys };

}