import { useSelector, useDispatch } from "react-redux";
import { optionsStatusApplications } from "../../../utils/constant";
import { getValueFilter } from "../../../utils/functions";
import { setJobbankFiltersData } from "../../../redux/jobBankDuck";
import WebApiJobBank from "../../../api/WebApiJobBank";
import moment from "moment";
import { useState } from "react";

export const useFiltersApplications = () =>{

    const {
        list_vacancies_options,
        load_vacancies_options,
        list_clients_options,
        load_clients_options
    } = useSelector(state => state.jobBankStore);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const format = 'DD-MM-YYYY';

    const getCandidate = async (id, key) =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getInfoCandidate(id);
            let value = { [key]: response.data };
            dispatch(setJobbankFiltersData(value));
            setLoading(false)
            return `${response.data?.first_name} ${response.data?.last_name}`;
        } catch (e) {
            console.log(e)
            setLoading(true)
            return id;
        }
    }

    const getCustomer = (id) => getValueFilter({
        value: id,
        list: list_clients_options
    })

    const getVacant = (id) => getValueFilter({
        value: id,
        list: list_vacancies_options,
        keyShow: 'job_position'
    })

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusApplications,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getDate = (value) =>{
        let dates = value.split(',');
        let start = moment(dates[0], 'YYYY-MM-DD').format(format);
        let end = moment(dates[1], 'YYYY-MM-DD').format(format);
        return `${start} - ${end}`;
    }
    
    const deleteState = (key) => {
        dispatch(setJobbankFiltersData({ [key]: null }))
    }

    const listAwait = {
        candidate: getCandidate
    }

    const listKeys = {
        candidate: {
            name: 'Candidato',
            loading: loading,
            delete: deleteState
        },
        vacant__customer: {
            name: 'Cliente',
            get: getCustomer,
            loading: load_clients_options
        },
        vacant: {
            name: 'Vacante',
            get: getVacant,
            loading: load_vacancies_options
        },
        status: {
            name: 'Estatus',
            get: getStatus
        },
        date: {
            name: 'Fecha',
            get: getDate
        },
    }
    
    return {
        listKeys,
        listAwait
    }
}