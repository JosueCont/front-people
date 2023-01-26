import { useSelector } from "react-redux";
import { optionsStatusSelection } from "../../../utils/constant";

export const useFiltersSelection = () =>{

    const {
        list_vacancies_options,
        load_vacancies_options,
        load_candidates_options,
        list_candidates_options,
    } = useSelector(state => state.jobBankStore);
    const paramsOptions = { keyEquals: 'value', keyShow: 'label' };

    const listKeys = {
        status_process: 'Estatus',
        vacant: 'Vacante',
        candidate: 'Candidato'
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

    const getStatus = (value) => getValue({
        value,
        list: optionsStatusSelection,
        ...paramsOptions
    })

    const getVacant = (id) => getValue({
        value: id,
        list: list_vacancies_options,
        keyShow: 'job_position'
    })

    const getCandidate = (id) =>{
        if(!id) return id;
        const find_ = item => item.id == id;
        let result = list_candidates_options.find(find_);
        if(!result) return id;
        return `${result?.fisrt_name} ${result.last_name}`;
    }

    const listGets = {
        status_process: getStatus,
        vacant: getVacant,
        candidate: getCandidate
    }

    return { listKeys, listGets };
}