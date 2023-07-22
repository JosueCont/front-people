import { useDispatch, useSelector } from "react-redux";
import WebApiPeople from "../../../api/WebApiPeople";
import { getFullName, getValueFilter } from "../../../utils/functions";
import { optionsTypeEvents } from "../../../utils/constant";
import { setTimeclockFiltersData } from "../../../redux/timeclockDuck";

export const useFiltersLogs = () => {
    
    const {
        list_companies,
        load_companies
    } = useSelector(state => state.timeclockStore);
    const dispatch = useDispatch();

    const listKeys = {
        person: 'Colaborador',
        type: 'Tipo',
        timestamp__date: 'Fecha',
        node: 'Empresa'
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

    const listGets = {
        person: getPerson,
        type: getType,
        node: getNode
    }

    return {
        listKeys,
        listGets
    }

}