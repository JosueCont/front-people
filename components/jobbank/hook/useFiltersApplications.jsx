import { useSelector } from "react-redux";
import { optionsStatusApplications } from "../../../utils/constant";
import { getValueFilter } from "../../../utils/functions";
import moment from "moment";

export const useFiltersApplications = () =>{

    const {
        list_applications_candidates,
        load_applications_candidates,
        list_vacancies_options,
        load_vacancies_options,
        list_clients_options,
        load_clients_options
    } = useSelector(state => state.jobBankStore);
    const format = 'DD-MM-YYYY';

    const listKeys = {
        candidate: 'Candidato',
        vacant__customer: 'Cliente',
        vacant: 'Vacante',
        status: 'Estatus',
        date: 'Fecha',
    }

    const getCandidate = (id) => getValueFilter({
        value: id,
        list: list_applications_candidates,
        keyShow: e => `${e?.first_name} ${e.last_name}`
    })

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

    const listGets = {
        candidate: getCandidate,
        vacant__customer: getCustomer,
        vacant: getVacant,
        status: getStatus,
        date: getDate
    }
    
    return { listKeys, listGets }
}