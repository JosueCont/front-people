import { useSelector } from "react-redux";
import { getValueFilter } from "../../../utils/functions";
import { optionsStatusVacant } from "../../../utils/constant";

export const useFiltersPublications = () =>{

    const {
        list_connections_options,
        load_connections_options,
        list_vacancies_options,
        load_vacancies_options,
        list_profiles_options,
        load_profiles_options
    } = useSelector(state => state.jobBankStore);

    const listKeys = {
        account_to_share: 'Cuenta',
        vacant: 'Vacante',
        vacant__status: 'Estatus vacante',
        profile: 'Template',
        is_published: 'Estatus'
    }

    const getVacant = (id) => getValueFilter({
        value: id,
        list: list_vacancies_options,
        keyShow: 'job_position'
    })

    const getVacantStatus = (value) => getValueFilter({
        value,
        list: optionsStatusVacant,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getTemplate = (id) => {
        if(id == 'open_fields') return 'Personalizado';
        return getValueFilter({
            value: id,
            list: list_profiles_options
        })
    }

    const getStatus = (value) => value == 'true' ? 'Publicado' : 'En borrador';

    const getAccount = (value) =>{
        let codes = value ? JSON.parse(value) : [];
        return codes.reduce((acc, current) =>{
            return `${acc ? acc+', ' : ''}${getValueFilter({
                value: current,
                list: list_connections_options,
                keyEquals: 'code',
                keyShow: 'name'
            })}`
        }, '')
    }

    const listGets = {
        account_to_share: getAccount,
        vacant: getVacant,
        vacant__status: getVacantStatus,
        profile: getTemplate,
        is_published: getStatus
    }

    return { listKeys, listGets }
}