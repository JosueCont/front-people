import { optionsStatusVacation } from "../../../utils/constant";
import { getValueFilter, getFullName } from "../../../utils/functions";
import { useSelector } from "react-redux";

export const useFiltersRequests = () => {

    const {
        persons_company,
        load_persons
    } = useSelector(state => state.userStore);

    const listKeys = {
        person__id: 'Colaborador',
        immediate_supervisor: 'Jefe inmediato',
        status: 'Estatus',
        period: 'Periodo',
        range: 'Fechas'
    }

    const getDate = (value) => {
        let dates = value.split(',');
        return `${dates[0]} - ${dates[1]}`;
    }

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusVacation,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getPerson = (id) => getValueFilter({
        value: id,
        list: persons_company,
        keyShow: e => getFullName(e)
    })

    const getPeriod = (value) => {
        let year = parseInt(value);
        return `${year} - ${year + 1}`;
    }

    const listGets = {
        range: getDate,
        status: getStatus,
        person__id: getPerson,
        immediate_supervisor: getPerson,
        period: getPeriod
    }

    return { listKeys, listGets }
}