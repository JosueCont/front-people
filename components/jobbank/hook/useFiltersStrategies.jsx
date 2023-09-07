import { useSelector } from "react-redux";
import { getValueFilter } from "../../../utils/functions";
import { optionsStatusVacant } from "../../../utils/constant";

export const useFiltersStrategies = () => {

    const {
        list_vacancies_options,
        load_vacancies_options,
        list_clients_options,
        load_clients_options
    } = useSelector(state => state.jobBankStore);

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

    const listKeys = {
        product__unaccent__icontains: {
            name: 'Producto',
        },
        customer: {
            name: 'Cliente',
            get: getCustomer,
            loading: load_clients_options
        },
        vacant: {
            name: 'Vacante',
            get: getVacant,
            loading: load_vacancies_options
        },
        vacant__status: {
            name: 'Estatus vacante',
            get: getVacanStatus
        }
    }

    return { listKeys }

}