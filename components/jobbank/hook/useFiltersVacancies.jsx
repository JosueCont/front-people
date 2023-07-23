import { useSelector, useDispatch } from "react-redux";
import { optionsStatusVacant } from "../../../utils/constant";
import { getFullName } from "../../../utils/functions";
import { getValueFilter } from "../../../utils/functions";
import { setJobbankFiltersData } from "../../../redux/jobBankDuck";
import WebApiPeople from "../../../api/WebApiPeople";

export const useFiltersVacancies = () =>{

    const {
        list_clients_options,
        load_clients_options,
    } = useSelector(state => state.jobBankStore);
    const dispatch = useDispatch();
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

    const getRecruiter = async (id, key) => {
        try {
            let response = await WebApiPeople.getPerson(id);
            let value = {[key]: response.data};
            dispatch(setJobbankFiltersData(value))
            return getFullName(response.data);
        } catch (e) {
            console.log(e)
            return id;
        }
    }

    const listAwait = {
        strategy__recruiter_id: getRecruiter
    }

    const listGets = {
        status: getStatus,
        customer: getCustomer
    }

    return {
        listKeys,
        listGets,
        listAwait
    }
}