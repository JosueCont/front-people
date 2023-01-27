import { useSelector } from "react-redux";
import { getFullName } from "../../../utils/functions";

export const useFiltersInterviews = () =>{

    const {
        load_candidates_options,
        list_candidates_options,
        list_vacancies_options,
        load_vacancies_options,
    } = useSelector(state => state.jobBankStore);
    const {
        load_persons,
        persons_company
    } = useSelector(state => state.userStore);
    const paramsOptions = { keyEquals: 'value', keyShow: 'label' };

    const listKeys = {
        recruiter: 'Reclutador',
        candidate: 'Candidate',
        vacant: 'Vacante',
        date: 'Fecha',
        status: 'Estatus'
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
        return typeof keyShow == 'function'
            ? keyShow(result) : result[keyShow];
    }

    const getRecruiter = (id) => getValue({
        value: id,
        list: persons_company,
        keyShow: getFullName
    })

    const getCandidate = (id) => getValue({
        value: id,
        list: list_candidates_options,
        keyShow: e => `${e?.fisrt_name} ${e?.last_name}`
    })

    const getVacant = (id) => getValue({
        value: id,
        list: list_vacancies_options,
        keyShow: 'job_position'
    })

    const listGets = {
        recruiter: getRecruiter,
        candidate: getCandidate,
        vacant: getVacant
    }

    return { listKeys, listGets };
}