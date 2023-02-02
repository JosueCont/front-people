import { useSelector } from "react-redux";
import { getValueFilter } from "../../../utils/functions";
import { optionsStatusVacant } from "../../../utils/constant";

export const useFiltersStrategies = () =>{

    const {
        list_vacancies_options,
        load_vacancies_options,
        list_clients_options,
        load_clients_options
    } = useSelector(state => state.jobBankStore);

    const listKeys = {
        product__unaccent__icontains: 'Producto',
        customer: 'Cliente',
        vacant: 'Vacante',
        vacant__status: 'Estatus vacante'
    }

    const getCustomer = (id) => getValueFilter({
        value: id,
        list: list_clients_options
    })

    const getVacant = (id) => getValueFilter({
        value: id,
        list: list_vacancies_options,
        keyShow: 'job_position'
    })

    const getVacanStatus = (value) => getValueFilter({
        value,
        list: optionsStatusVacant,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const listGets = {
        customer: getCustomer,
        vacant: getVacant,
        vacant__status: getVacanStatus
    }

    return { listKeys, listGets }

}