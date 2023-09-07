import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { optionsStatusVacant } from "../../../utils/constant";
import { getValueFilter } from "../../../utils/functions";
import WebApiPeople from "../../../api/WebApiPeople";
import { getFullName } from "../../../utils/functions";
import { useRouter } from "next/router";

export const useFiltersVacancies = () => {

    const {
        list_clients_options,
        load_clients_options,
    } = useSelector(state => state.jobBankStore);

    const router = useRouter();
    const { strategy__recruiter_id } = router.query;

    const [loading, setLoading] = useState(true);
    const [recruiter, setRecruiter] = useState({});

    useEffect(() => {
        if (!strategy__recruiter_id) setRecruiter({});
        else getRecruiter();
    }, [strategy__recruiter_id])

    const getRecruiter = async () => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getPerson(strategy__recruiter_id);
            setRecruiter(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setRecruiter({})
        }
    }

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

    const listKeys = {
        job_position__unaccent__icontains: {
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
            get: (e) => Object.keys(recruiter).length > 0 ? getFullName(recruiter) : e
        }
    }

    const listData = {
        recruiter
    }

    return {
        listKeys,
        listData
    }
}