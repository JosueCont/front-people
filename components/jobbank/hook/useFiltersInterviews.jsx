import { useSelector, useDispatch } from "react-redux";
import { getFullName } from "../../../utils/functions";
import { getValueFilter } from "../../../utils/functions";
import { setJobbankFiltersData } from "../../../redux/jobBankDuck";
import WebApiPeople from "../../../api/WebApiPeople";

export const useFiltersInterviews = () =>{

    const {
        load_candidates_options,
        list_candidates_options,
        list_vacancies_options,
        load_vacancies_options,
        list_clients_options,
        load_clients_options
    } = useSelector(state => state.jobBankStore);
    
    const dispatch = useDispatch();

    const listKeys = {
        recruiter: 'Reclutador',
        candidate: 'Candidato',
        vacant: 'Vacante',
        customer: 'Cliente'
    }

    // const getRecruiter = (id) => getValueFilter({
    //     value: id,
    //     list: persons_company,
    //     keyShow: getFullName
    // })

    const getRecruiter = async (id, key) => {
        try {
            let response = await WebApiPeople.getPerson(id);
            let value = {[key]: response.data};
            dispatch(setJobbankFiltersData(value))
            return getFullName(response.data);
        } catch (e) {
            console.log(e)
            return id;
        }
    }

    const getCandidate = (id) => getValueFilter({
        value: id,
        list: list_candidates_options,
        keyShow: e => `${e?.first_name} ${e?.last_name}`
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