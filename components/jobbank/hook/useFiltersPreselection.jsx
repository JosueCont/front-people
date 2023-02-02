import { useSelector } from "react-redux";
import {
    optionsGenders,
    optionsStatusAcademic,
    optionsLangVacant
} from "../../../utils/constant";
import { getValueFilter } from "../../../utils/functions";

export const useFiltersPreselection = () =>{

    const {
        load_main_categories,
        list_main_categories,
        list_states,
        load_states,
        load_scholarship,
        list_scholarship
    } = useSelector(state => state.jobBankStore);
    const paramsOptions = { keyEquals: 'value', keyShow: 'label' };

    const listKeys = {
        fisrt_name__unaccent__icontains: 'Nombre',
        last_name__unaccent__icontains: 'Apellidos',
        email__unaccent__icontains: 'Correo',
        main_category: 'Categoría',
        gender: 'Género',
        state: 'Estado',
        municipality__unaccent__icontains: 'Municipio',
        study_level: 'Nivel de estudios',
        status_level_study: 'Estatus académico',
        last_job: 'Puesto',
        age: 'Edad',
        language: 'Idioma',
        age_start: 'Edad mínima',
        age_end: 'Edad máxima'
    }
    
    const getCategory = (id) => getValueFilter({
        value: id,
        list: list_main_categories
    });

    const getState = (id) => getValueFilter({
        value: id,
        list: list_states
    });

    const getGender = (value) => getValueFilter({
        value,
        list: optionsGenders,
        ...paramsOptions
    });

    const getStudy = (id) => getValueFilter({
        value: id,
        list: list_scholarship
    });

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusAcademic,
        ...paramsOptions
    });

    const getLang = (value) => getValueFilter({
        value,
        list: optionsLangVacant,
        ...paramsOptions
    })

    const listGets = {
        main_category: getCategory,
        state: getState,
        gender: getGender,
        study_level: getStudy,
        status_level_study: getStatus,
        language: getLang
    }

    return { listKeys, listGets };

}