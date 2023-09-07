import { useState, useEffect } from "react";
import { optionsStatusVacation } from "../../../utils/constant";
import { getValueFilter, getFullName } from "../../../utils/functions";
import WebApiPeople from "../../../api/WebApiPeople";
import { useRouter } from "next/router";

export const useFiltersRequests = () => {

    const router = useRouter();
    const {
        person__id,
        immediate_supervisor
    } = router.query;

    const inital = { person: {}, supervisor: {} };
    const load = { person: true, supervisor: true };
    const [person, setPerson] = useState(inital);
    const [loading, setLoading] = useState(load)

    const set_ = (prev, key, value) => ({ ...prev, [key]: value });
    const setInfo = (key, value = {}) => setPerson(e => set_(e, key, value));
    const setLoad = (key, value = false) => setLoading(e => set_(e, key, value));

    useEffect(() => {
        if (!person__id) setInfo('person')
        else getPerson(person__id, 'person');
    }, [person__id])

    useEffect(() => {
        if (!immediate_supervisor) setInfo('supervisor');
        else getPerson(immediate_supervisor, 'supervisor');
    }, [immediate_supervisor])

    const getPerson = async (id, key) => {
        try {
            setLoad(key, true)
            let response = await WebApiPeople.getPerson(id);
            setInfo(key, response.data)
            setLoad(key)
        } catch (e) {
            console.log(e)
            setInfo(key)
            setLoad(key)
        }
    }

    const getDate = (value) => {
        let dates = value.split(',');
        return `${dates[0]} - ${dates[1]}`;
    }

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusVacation,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getStatusList = (value) => {
        if (value == '6') return 'Todas';
        const reduce_ = (acc, item) => ([...acc, getStatus(item)]);
        let status = value.split(',').reduce(reduce_, []);
        return status?.join(', ');
    }

    const getPeriod = (value) => {
        let year = parseInt(value);
        return `${year} - ${year + 1}`;
    }

    const listKeys = {
        person__id: {
            name: 'Colaborador',
            get: (e) => Object.keys(person?.person).length > 0 ? getFullName(person?.person) : e,
            loading: loading['person']
        },
        immediate_supervisor: {
            name: 'Jefe inmediato',
            get: (e) => Object.keys(person?.supervisor).length > 0 ? getFullName(person?.supervisor) : e,
            loading: loading['supervisor']
        },
        status__in: {
            name: 'Estatus',
            get: getStatusList
        },
        period: {
            name: 'Periodo',
            get: getPeriod
        },
        range: {
            name: 'Fechas',
            get: getDate
        }
    }

    const listData = {
        ...person
    }

    return {
        listKeys,
        listData
    }
}