import { optionsStatusPermits } from "../../../utils/constant";
import { getValueFilter, getFullName } from "../../../utils/functions";
import { useSelector } from "react-redux";

export const useFiltersPermission = () =>{

    const {
        persons_company,
        load_persons
    } = useSelector(state => state.userStore);
    const {
        cat_departments
    } = useSelector(state => state.catalogStore);

    const listKeys = {
        person__id: 'Colaborador',
        status: 'Estatus',
        department__id: 'Departamento'
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

    const getDeparment = (id) => getValueFilter({
        value: id,
        list: cat_departments
    })

    const listGets = {
        status: getStatus,
        person__id: getPerson,
        department__id: getDeparment
    }

    return { listKeys, listGets }
}