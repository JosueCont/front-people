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

    const listKeys = {
        first_name__unaccent__icontains: {
            name: 'Nombre'
        },
        last_name__unaccent__icontains: {
            name: 'Apellidos'
        },
        email__unaccent__icontains: {
            name: 'Correo electrónico'
        },
        main_category: {
            name: 'Categoría',
            get: getCategory,
            loading: load_main_categories
        },
        gender: {
            name: 'Género',
            get: getGender
        },
        state: {
            name: 'Estado',
            get: getState,
            loading: load_states
        },
        municipality__unaccent__icontains: {
            name: 'Municipio'
        },
        study_level: {
            name: 'Nivel de estudios',
            get: getStudy,
            loading: load_scholarship
        },
        status_level_study: {
            name: 'Estatus académico',
            get: getStatus
        },
        last_job: {
            name: 'Puesto'
        },
        language: {
            name: 'Idioma',
            get: getLang
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