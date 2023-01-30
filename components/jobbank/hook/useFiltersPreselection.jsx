import { useSelector } from "react-redux";
import {
    optionsGenders,
    optionsStatusAcademic,
    optionsLangVacant
} from "../../../utils/constant";

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

    const getValue = ({
        value = '',
        list = [],
        keyEquals = 'id',
        keyShow = 'name'
    }) =>{
        if(!value) return value;
        const find_ = item => item[keyEquals] == value;
        let result = list.find(find_);
        if(!result) return value;
        return result[keyShow];
    }

    const getCategory = (id) => getValue({
        value: id,
        list: list_main_categories
    });

    const getState = (id) => getValue({
        value: id,
        list: list_states
    });

    const getGender = (value) => getValue({
        value,
        list: optionsGenders,
        ...paramsOptions
    });

    const getStudy = (id) => getValue({
        value: id,
        list: list_scholarship
    });

    const getStatus = (value) => getValue({
        value,
        list: optionsStatusAcademic,
        ...paramsOptions
    });

    const getLang = (value) => getValue({
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