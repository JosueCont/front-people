import { useSelector } from "react-redux";
import { optionsStatusSelection } from "../../../utils/constant";
import { getValueFilter } from "../../../utils/functions";

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

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusSelection,
        ...paramsOptions
    })

    const getVacant = (id) => getValueFilter({
        value: id,
        list: list_vacancies_options,
        keyShow: 'job_position'
    })

    const getCandidate = (id) => getValueFilter({
        value: id,
        list: list_candidates_options,
        keyShow: e => `${e?.fisrt_name} ${e.last_name}`
    })

    const listGets = {
        status_process: getStatus,
        vacant: getVacant,
        candidate: getCandidate
    }

    return { listKeys, listGets };
}