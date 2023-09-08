import { useSelector } from "react-redux";
import WebApiPeople from "../../../api/WebApiPeople";
import { getFullName, getValueFilter, getWork } from "../../../utils/functions";
import { optionsTypeEvents } from "../../../utils/constant";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export const useFiltersLogs = () => {

    const {
        list_companies,
        load_companies,
        list_work_centers_options,
        load_work_centers_options,
    } = useSelector(state => state.timeclockStore);

    const router = useRouter();
    const { person } = router.query;

    const [loading, setLoading] = useState(true);
    const [infoPerson, setInfoPerson] = useState({});

    useEffect(() => {
        if (!person) setInfoPerson({});
        else getPerson();
    }, [person])

    const getPerson = async () => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getPerson(person);
            setInfoPerson(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setInfoPerson({})
            setLoading(false)
        }
    }

    const getType = (value) => getValueFilter({
        value,
        list: optionsTypeEvents,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getNode = (id) => getValueFilter({
        value: id,
        list: list_companies
    })

    const getWork = (id) => getValueFilter({
        value: id,
        list: list_work_centers_options
    })

    const listKeys = {
        person: {
            name: 'Colaborador',
            loading: loading,
            get: (e) => Object.keys(infoPerson).length > 0 ? getFullName(infoPerson) : e
        },
        type: {
            name: 'Tipo',
            get: getType
        },
        timestamp__date: {
            name: 'Fecha'
        },
        node: {
            name: 'Empresa',
            get: getNode,
            loading: load_companies
        },
        workcenter: {
            name: 'Centro de trabajo',
            get: getWork,
            loading: load_work_centers_options
        }
    }

    const listData = {
        person: infoPerson
    }

    return {
        listKeys,
        listData
    }

}