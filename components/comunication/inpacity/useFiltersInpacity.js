import { optionsStatusPermits } from "../../../utils/constant";
import { getValueFilter, getFullName } from "../../../utils/functions";
import { useSelector } from "react-redux";

export const useFiltersIncapacity = () =>{

    const {
        persons_company,
        load_persons
    } = useSelector(state => state.userStore);

    const listKeys = {
        person__id: 'Colaborador',
        status: 'Estatus'
    }
    
    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusPermits,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getPerson = (id) => getValueFilter({
        value: id,
        list: persons_company,
        keyShow: e => getFullName(e)
    })

    const listGets = {
        status: getStatus,
        person__id: getPerson
    }

    return { listKeys, listGets }
}