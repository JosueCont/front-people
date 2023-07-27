import { optionsStatusVacation } from "../../../utils/constant";
import { getValueFilter, getFullName } from "../../../utils/functions";
import { useSelector, useDispatch } from "react-redux";
import WebApiPeople from "../../../api/WebApiPeople";
import { setUserFiltersData } from "../../../redux/UserDuck";

export const useFiltersRequests = () => {
    
    const dispatch = useDispatch();

    const listKeys = {
        person__id: 'Colaborador',
        immediate_supervisor: 'Jefe inmediato',
        status__in: 'Estatus',
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

    const getStatusList = (value) => {
        if (value == '6') return 'Todas';
        const reduce_ = (acc, item) => ([...acc, getStatus(item)]);
        let status = value.split(',').reduce(reduce_, []);
        return status?.join(', ');
    }

    const getPerson = async (id, key) => {
        try {
            let response = await WebApiPeople.getPerson(id);
            let value = {[key]: response.data};
            dispatch(setUserFiltersData(value))
            return getFullName(response.data);
        } catch (e) {
            console.log(e)
            return id;
        }
    }

    const deleteState = (key) =>{
        dispatch(setUserFiltersData({[key] : null}))
    }

    const getPeriod = (value) => {
        let year = parseInt(value);
        return `${year} - ${year + 1}`;
    }

    const listAwait = {
        person__id: getPerson,
        immediate_supervisor: getPerson,
    }

    const listGets = {
        range: getDate,
        status__in: getStatusList,
        period: getPeriod
    }

    const listDelete = {
        person__id: deleteState,
        immediate_supervisor: deleteState
    }

    return {
        listKeys,
        listGets,
        listAwait,
        listDelete
    }
}