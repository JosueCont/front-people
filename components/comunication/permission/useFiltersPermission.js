import { useState, useEffect } from "react";
import { optionsStatusPermits } from "../../../utils/constant";
import { getValueFilter, getFullName } from "../../../utils/functions";
import { useSelector } from "react-redux";
import WebApiPeople from "../../../api/WebApiPeople";
import { useRouter } from "next/router";

export const useFiltersPermission = () => {

    const {
        cat_departments
    } = useSelector(state => state.catalogStore);

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

    const getDeparment = (id) => getValueFilter({
        value: id,
        list: cat_departments
    })
    
    const listKeys = {
        person__id: {
            name: 'Colaborador',
            loading: loadPerson,
            get: (e) => Object.keys(person).length > 0 ? getFullName(person) : e
        },
        status: {
            name: 'Estatus',
            get: getStatus
        },
        department__id: {
            name: 'Departamento',
            get: getDeparment
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