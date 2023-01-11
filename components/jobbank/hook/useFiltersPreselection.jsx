import { useSelector } from "react-redux";
import { optionsGenders } from "../../../utils/constant";

export const useFiltersPreselection = () =>{

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
        name: 'Nombre',
        lastname: 'Apellidos',
        email: 'Correo',
        main_category: 'Categoría',
        gender: 'Género',
        state: 'Estado',
        municipality__unaccent__icontains: 'Municipio'
    }

    const getCategory = (id) =>{
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

    const getGender = (value) =>{
        if(!value) return value;
        const find_ = item => item.value == value;
        let result = optionsGenders.find(find_);
        if(!result) return value;
        return result.label;
    }

    const listGets = {
        main_category: getCategory,
        state: getState,
        gender: getGender
    }

    return { listKeys, listGets }

}