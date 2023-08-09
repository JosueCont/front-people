import { useState } from "react";
import { optionsStatusVacation } from "../../../utils/constant";
import { getValueFilter, getFullName } from "../../../utils/functions";
import { useDispatch } from "react-redux";
import WebApiPeople from "../../../api/WebApiPeople";
import { setUserFiltersData } from "../../../redux/UserDuck";

export const useFiltersRequests = () => {
    
    const dispatch = useDispatch();
    const [loading, setLoading] = useState({
        person__id: true,
        immediate_supervisor: true
    });

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
            setLoading(prev =>({...prev, [key]: true}))
            let response = await WebApiPeople.getPerson(id);
            let value = {[key]: response.data};
            dispatch(setUserFiltersData(value))
            setLoading(prev =>({...prev, [key]: false}))
            return getFullName(response.data);
        } catch (e) {
            console.log(e)
            setLoading(prev =>({...prev, [key]: false}))
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

    const listKeys = {
        person__id: {
            name: 'Colaborador',
            delete: deleteState,
            loading: loading['person__id']
        },
        immediate_supervisor: {
            name: 'Jefe inmediato',
            delete: deleteState,
            loading: loading['immediate_supervisor']
        },
        status__in: {
            name: 'Estatus',
            get: getStatusList
        },
        period: {
            name: 'Periodo',
            get: getPeriod
        },
        range: {
            name: 'Fechas',
            get: getDate
        }
    }

    return {
        listKeys,
        listAwait
    }
}