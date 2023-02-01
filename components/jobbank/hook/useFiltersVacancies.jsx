import { useSelector } from "react-redux";
import { optionsStatusVacant } from "../../../utils/constant";
import { getFullName } from "../../../utils/functions";

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

    const getValue = ({
        value = '',
        list = [],
        keyEquals = 'id',
        keyShow = 'name'
    }) =>{
        if(!value) return value;
        const find_ = item => item[keyEquals] == value;
        let result = list.find(find_);
        if(!result) return value;
        return typeof keyShow == 'function'
            ? keyShow(result) : result[keyShow];
    }

    const getStatus = (value) => getValue({
        value,
        list: optionsStatusVacant,
        ...paramsOptions
    })

    const getCustomer = (id) => getValue({
        value: id,
        list: list_clients_options
    })

    const getRecruiter = (id) => getValue({
        value: id,
        list: persons_company,
        keyShow: e => getFullName(e)
    })

    const listGets = {
        status: getStatus,
        customer: getCustomer,
        strategy__recruiter_id: getRecruiter
    }

    return { listKeys, listGets }
}