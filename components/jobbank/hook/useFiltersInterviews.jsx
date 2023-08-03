import { useSelector, useDispatch } from "react-redux";
import { getValueFilter } from "../../../utils/functions";
import { setJobbankFiltersData } from "../../../redux/jobBankDuck";
import { getFullName } from "../../../utils/functions";
import WebApiJobBank from "../../../api/WebApiJobBank";
import WebApiPeople from "../../../api/WebApiPeople";
import { useState } from "react";

export const useFiltersInterviews = () => {

    const {
        list_vacancies_options,
        load_vacancies_options,
        list_clients_options,
        load_clients_options
    } = useSelector(state => state.jobBankStore);

    const [loading, setLoading] = useState(true);
    const [loadRecruiter, setLoadRecruiter] = useState(true);
    
    const dispatch = useDispatch();

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
            setLoadRecruiter(true)
            let response = await WebApiPeople.getPerson(id);
            let value = { [key]: response.data };
            dispatch(setJobbankFiltersData(value))
            setLoadRecruiter(false)
            return getFullName(response.data);
        } catch (e) {
            console.log(e)
            setLoadRecruiter(false)
            return id;
        }
    }

    const getCandidate = async (id, key) => {
        try {
            setLoading(true)
            let response = await WebApiJobBank.getInfoCandidate(id);
            let value = { [key]: response.data };
            dispatch(setJobbankFiltersData(value));
            setLoading(false)
            return `${response.data?.first_name} ${response.data?.last_name}`;
        } catch (e) {
            console.log(e)
            setLoading(false)
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

    const listKeys = {
        recruiter: {
            name: 'Reclutador',
            loading: loadRecruiter,
            delete: deleteState
        },
        candidate: {
            name: 'Candidato',
            loading: loading,
            delete: deleteState
        },
        vacant: {
            name: 'Vacante',
            get: getVacant,
            loading: load_vacancies_options
        },
        customer: {
            name: 'Cliente',
            get: getCustomer,
            loading: load_clients_options
        }
    }

    return {
        listKeys,
        listAwait
    };
}