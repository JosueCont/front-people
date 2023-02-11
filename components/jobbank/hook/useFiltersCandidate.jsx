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

    const listKeys = {
        first_name__unaccent__icontains: 'Nombre',
        last_name__unaccent__icontains: 'Apellidos',
        email__unaccent__icontains: 'Correo',
        cell_phone: 'Teléfono',
        last_job: 'Puesto',
        is_active: 'Estatus',
        main_category: 'Categoría',
        sector: 'Sector',
        state: 'Estado',
        municipality__unaccent__icontains: 'Municipio',
        sub_category: 'Subcategoría',
        age_start: 'Edad mínima',
        age_end: 'Edad máxima'
    }

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

    const listGets = {
        main_category: getCategory,
        state: getState,
        is_active: getStatus,
        sector: getSector,
        sub_category: getSubCategory
    }

    return { listKeys, listGets };

}