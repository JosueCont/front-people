import { useState, useEffect } from "react";
import { optionsStatusPermits } from "../../../utils/constant";
import { getValueFilter, getFullName } from "../../../utils/functions";
import { useRouter } from "next/router";
import WebApiPeople from "../../../api/WebApiPeople";

export const useFiltersIncapacity = () => {

    const router = useRouter();
    const { person__id } = router.query;

    const [person, setPerson] = useState({});
    const [loadPerson, setLoadPerson] = useState(true);

    useEffect(() => {
        if (!person__id) setPerson({});
        else getPerson();
    }, [person__id])

    const getPerson = async () => {
        try {
            setLoadPerson(true)
            let response = await WebApiPeople.getPerson(person__id);
            setPerson(response.data);
            setLoadPerson(false)
        } catch (e) {
            console.log(e)
            setPerson({})
            setLoadPerson(false)
        }
    }

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusPermits,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const listKeys = {
        person__id: {
            name: 'Colaborador',
            get: (e) => Object.keys(person).length > 0 ? getFullName(person) : e,
            loading: loadPerson
        },
        status: {
            name: 'Estatus',
            get: getStatus
        }
    }

    const listData = {
        person
    }

    return {
        listKeys,
        listData
    }
}