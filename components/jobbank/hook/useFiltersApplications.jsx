import { useSelector } from "react-redux";
import { optionsStatusApplications } from "../../../utils/constant";
import { getValueFilter } from "../../../utils/functions";
import moment from "moment";

export const useFiltersApplications = () =>{

    const {
        load_main_categories,
        list_main_categories,
        list_states,
        load_states,
        list_sectors,
        load_sectors,
        load_sub_categories,
        list_sub_categories,
        list_applications,
        list_vacancies_options,
        load_vacancies_options
    } = useSelector(state => state.jobBankStore);
    const format = 'DD-MM-YYYY';

    const listKeys = {
        candidate: 'Candidato',
        vacant: 'Vacante',
        status: 'Estatus',
        date: 'Fecha',
    }

    const getCandidate = (id) => getValueFilter({
        value: id,
        list: list_applications.candidates,
        keyShow: e => `${e?.fisrt_name} ${e.last_name}`
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
        let start = moment(dates[0], format).format(format);
        let end = moment(dates[1], format).format(format);
        return `${start} - ${end}`;
    } 

    const listGets = {
        candidate: getCandidate,
        vacant: getVacant,
        status: getStatus,
        date: getDate
    }
    
    return { listKeys, listGets }
}