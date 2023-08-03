import { optionsStatusPermits } from "../../../utils/constant";
import { getValueFilter, getFullName } from "../../../utils/functions";
import { useSelector } from "react-redux";

export const useFiltersIncapacity = () =>{

    const {
        persons_company,
        load_persons
    } = useSelector(state => state.userStore);
    
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

    const listKeys = {
        person__id: {
            name: 'Colaborador',
            get: getPerson,
            loading: load_persons
        },
        status: {
            name: 'Estatus',
            get: getStatus
        }
    }

    return { listKeys }
}