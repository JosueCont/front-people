import { useSelector, useDispatch } from "react-redux";
import { optionsStatusApplications } from "../../../utils/constant";
import { getValueFilter } from "../../../utils/functions";
import { setJobbankFiltersData } from "../../../redux/jobBankDuck";
import WebApiJobBank from "../../../api/WebApiJobBank";
import moment from "moment";

export const useFiltersApplications = () =>{

    const {
        list_vacancies_options,
        list_clients_options,
    } = useSelector(state => state.jobBankStore);

    const dispatch = useDispatch();

    const format = 'DD-MM-YYYY';

    const listKeys = {
        candidate: 'Candidato',
        vacant__customer: 'Cliente',
        vacant: 'Vacante',
        status: 'Estatus',
        date: 'Fecha',
    }

    const getCandidate = async (id, key) =>{
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

    const listGets = {
        vacant__customer: getCustomer,
        vacant: getVacant,
        status: getStatus,
        date: getDate
    }

    const listAwait = {
        candidate: getCandidate
    }

    const listDelete = {
        candidate: deleteState
    }
    
    return {
        listKeys,
        listGets,
        listAwait,
        listDelete
    }
}