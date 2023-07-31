import { useDispatch, useSelector } from "react-redux";
import WebApiPeople from "../../../api/WebApiPeople";
import { getFullName, getValueFilter, getWork } from "../../../utils/functions";
import { optionsTypeEvents } from "../../../utils/constant";
import { setTimeclockFiltersData } from "../../../redux/timeclockDuck";

export const useFiltersLogs = () => {
    
    const {
        list_companies,
        load_companies,
        list_work_centers_options,
        load_work_centers_options,
    } = useSelector(state => state.timeclockStore);
    const dispatch = useDispatch();

    const listKeys = {
        person: 'Colaborador',
        type: 'Tipo',
        timestamp__date: 'Fecha',
        node: 'Empresa',
        workcenter: 'Centro de trabajo'
    }

    const getPerson = async (id, key) =>{
        try {
            let response = await WebApiPeople.getPerson(id);
            let value = {[key]: response.data};
            dispatch(setTimeclockFiltersData(value))
            return getFullName(response.data);
        } catch (e) {
            console.log(e)
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

    const listGets = {
        type: getType,
        node: getNode,
        workcenter: getWork
    }

    const listDelete = {
        person: deleteState
    }

    return {
        listKeys,
        listGets,
        listAwait,
        listDelete
    }

}