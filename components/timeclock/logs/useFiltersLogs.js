import { useDispatch, useSelector } from "react-redux";
import WebApiPeople from "../../../api/WebApiPeople";
import { getFullName, getValueFilter, getWork } from "../../../utils/functions";
import { optionsTypeEvents } from "../../../utils/constant";
import { setTimeclockFiltersData } from "../../../redux/timeclockDuck";
import { useState } from "react";

export const useFiltersLogs = () => {
    
    const {
        list_companies,
        load_companies,
        list_work_centers_options,
        load_work_centers_options,
    } = useSelector(state => state.timeclockStore);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const getPerson = async (id, key) =>{
        try {
            setLoading(true)
            let response = await WebApiPeople.getPerson(id);
            let value = {[key]: response.data};
            dispatch(setTimeclockFiltersData(value))
            setLoading(false)
            return getFullName(response.data);
        } catch (e) {
            console.log(e)
            setLoading(false)
            return id;
        }
    }
    
    const getType = (value) => getValueFilter({
        value,
        list: optionsTypeEvents,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getNode = (id) => getValueFilter({
        value: id,
        list: list_companies
    })

    const getWork = (id) => getValueFilter({
        value: id,
        list: list_work_centers_options
    })

    const deleteState = (key) => {
        dispatch(setTimeclockFiltersData({ [key]: null }))
    }

    const listAwait = {
        person: getPerson
    }

    const listKeys = {
        person: {
            name: 'Colaborador',
            loading: loading,
            delete: deleteState
        },
        type: {
            name: 'Tipo',
            get: getType
        },
        timestamp__date: {
            name: 'Fecha'
        },
        node: {
            name: 'Empresa',
            get: getNode,
            loading: load_companies
        },
        workcenter: {
            name: 'Centro de trabajo',
            get: getWork,
            loading: load_work_centers_options
        }
    }

    return {
        listKeys,
        listAwait
    }

}