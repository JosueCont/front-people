import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import WebApiPeople from "../../../../api/WebApiPeople";
import { getFullName, getValueFilter } from "../../../../utils/functions";

export const useFiltersHistory = () => {

    const {
        list_places_options,
        load_places_options
    } = useSelector(state => state.orgStore);

    const router = useRouter();
    const { person } = router.query;

    const [loading, setLoading] = useState(true);
    const [infoPerson, setInfoPerson] = useState({});

    useEffect(() => {
        if (!person) setInfoPerson({});
        else getPerson()
    }, [person])

    const getPerson = async () => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getPerson(person);
            setInfoPerson(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setInfoPerson({})
        }
    }

    const getPlace = (id) => getValueFilter({
        value: id,
        list: list_places_options
    })

    const listKeys = {
        position: {
            name: 'Plaza',
            loading: load_places_options,
            get: getPlace
        },
        person: {
            name: 'Persona',
            loading: loading,
            get: (e) => Object.keys(infoPerson).length > 0 ? getFullName(infoPerson) : e
        },
        is_current: {
            name: '¿Es actual?',
            get: (e) => e == 'true' ? 'Sí' : 'No'
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