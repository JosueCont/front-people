import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { optionsStatusVacant } from "../../../utils/constant";
import { getValueFilter } from "../../../utils/functions";
import WebApiPeople from "../../../api/WebApiPeople";
import { setJobbankFiltersData } from "../../../redux/jobBankDuck";
import { getFullName } from "../../../utils/functions";

export const useFiltersVacancies = () => {

    const {
        list_clients_options,
        load_clients_options,
    } = useSelector(state => state.jobBankStore);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusVacant,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getCustomer = (id) => getValueFilter({
        value: id,
        list: list_clients_options
    })

    const getRecruiter = async (id, key) => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getPerson(id);
            let value = { [key]: response.data };
            dispatch(setJobbankFiltersData(value))
            setTimeout(() => {
                setLoading(false)
            }, 500)
            return getFullName(response.data);
        } catch (e) {
            console.log(e)
            setLoading(false)
            return id;
        }
    }

    const deleteState = (key) => {
        dispatch(setJobbankFiltersData({ [key]: null }))
    }

    const listAwait = {
        strategy__recruiter_id: getRecruiter
    }

    const listKeys = {
        job_position__unaccent__icontains:{
            name: 'Nombre'
        },
        status: {
            name: 'Estatus',
            get: getStatus
        },
        customer: {
            name: 'Cliente',
            loading: load_clients_options,
            get: getCustomer
        },
        strategy__recruiter_id: {
            name: 'Reclutador',
            loading: loading,
            delete: deleteState
        }
    }

    return {
        listAwait,
        listKeys
    }
}