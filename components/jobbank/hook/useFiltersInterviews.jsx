import { useSelector } from "react-redux";
import { getFullName } from "../../../utils/functions";
import { getValueFilter } from "../../../utils/functions";

export const useFiltersInterviews = () =>{

    const {
        load_candidates_options,
        list_candidates_options,
        list_vacancies_options,
        load_vacancies_options,
        list_clients_options,
        load_clients_options
    } = useSelector(state => state.jobBankStore);
    const {
        load_persons,
        persons_company
    } = useSelector(state => state.userStore);
    const paramsOptions = { keyEquals: 'value', keyShow: 'label' };

    const listKeys = {
        recruiter: 'Reclutador',
        candidate: 'Candidato',
        vacant: 'Vacante',
        customer: 'Cliente'
    }

    // const getValueFilter = ({
    //     value = '',
    //     list = [],
    //     keyEquals = 'id',
    //     keyShow = 'name'
    // }) =>{
    //     if(!value) return value;
    //     const find_ = item => item[keyEquals] == value;
    //     let result = list.find(find_);
    //     if(!result) return value;
    //     return typeof keyShow == 'function'
    //         ? keyShow(result) : result[keyShow];
    // }

    const getRecruiter = (id) => getValueFilter({
        value: id,
        list: persons_company,
        keyShow: getFullName
    })

    const getCandidate = (id) => getValueFilter({
        value: id,
        list: list_candidates_options,
        keyShow: e => `${e?.fisrt_name} ${e?.last_name}`
    })

    const getVacant = (id) => getValueFilter({
        value: id,
        list: list_vacancies_options,
        keyShow: 'job_position'
    })

    const getCustomer = (id) => getValueFilter({
        value: id,
        list: list_clients_options
    })

    const listGets = {
        recruiter: getRecruiter,
        candidate: getCandidate,
        vacant: getVacant,
        customer: getCustomer
    }

    return { listKeys, listGets };
}