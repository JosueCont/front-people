import { useSelector } from "react-redux";
import { optionsStatusVacant } from "../../../utils/constant";
import { getFullName } from "../../../utils/functions";
import { getValueFilter } from "../../../utils/functions";

export const useFiltersVacancies = () =>{
    const {
        list_clients_options,
        load_clients_options
    } = useSelector(state => state.jobBankStore);
    const {
        load_persons,
        persons_company
    } = useSelector(state => state.userStore);
    const paramsOptions = { keyEquals: 'value', keyShow: 'label' };

    const listKeys = {
        job_position__unaccent__icontains: 'Nombre',
        status: 'Estatus',
        customer: 'Cliente',
        strategy__recruiter_id: 'Reclutador'
    }

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusVacant,
        ...paramsOptions
    })

    const getCustomer = (id) => getValueFilter({
        value: id,
        list: list_clients_options
    })

    const getRecruiter = (id) => getValueFilter({
        value: id,
        list: persons_company,
        keyShow: getFullName
    })

    const listGets = {
        status: getStatus,
        customer: getCustomer,
        strategy__recruiter_id: getRecruiter
    }

    return { listKeys, listGets }
}