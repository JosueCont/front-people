import { useSelector, useDispatch } from "react-redux";
import { getValueFilter } from "../../../utils/functions";
import { setJobbankFiltersData } from "../../../redux/jobBankDuck";
import { getFullName } from "../../../utils/functions";
import WebApiJobBank from "../../../api/WebApiJobBank";
import WebApiPeople from "../../../api/WebApiPeople";
 
export const useFiltersInterviews = () => {

    const {
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

    const getVacant = (id) => getValueFilter({
        value: id,
        list: list_vacancies_options,
        keyShow: 'job_position'
    })

    const getCustomer = (id) => getValueFilter({
        value: id,
        list: list_clients_options
    })

    const getRecruiter = async (id, key) => {
        try {
            let response = await WebApiPeople.getPerson(id);
            let value = { [key]: response.data };
            dispatch(setJobbankFiltersData(value))
            return getFullName(response.data);
        } catch (e) {
            console.log(e)
            return id;
        }
    }

    const getCandidate = async (id, key) => {
        try {
            let response = await WebApiJobBank.getInfoCandidate(id);
            let value = { [key]: response.data };
            dispatch(setJobbankFiltersData(value));
            return `${response.data?.first_name} ${response.data?.last_name}`;
        } catch (e) {
            console.log(e)
            return id;
        }
    }

    const deleteState = (key) => {
        dispatch(setJobbankFiltersData({ [key]: null }))
    }

    const listAwait = {
        recruiter: getRecruiter,
        candidate: getCandidate
    }

    const listGets = {
        vacant: getVacant,
        customer: getCustomer
    }

    const listDelete = {
        recruiter: deleteState,
        candidate: deleteState
    }

    return {
        listKeys,
        listGets,
        listAwait,
        listDelete
    };
}