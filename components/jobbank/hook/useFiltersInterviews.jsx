import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getValueFilter } from "../../../utils/functions";
import { getFullName } from "../../../utils/functions";
import WebApiJobBank from "../../../api/WebApiJobBank";
import WebApiPeople from "../../../api/WebApiPeople";
import { useRouter } from "next/router";

export const useFiltersInterviews = () => {

    const {
        list_vacancies_options,
        load_vacancies_options,
        list_clients_options,
        load_clients_options
    } = useSelector(state => state.jobBankStore);

    const router = useRouter();
    const { recruiter, candidate } = router.query;

    const [loading, setLoading] = useState(true);
    const [infoCandidate, setInfoCandate] = useState({});
    const [infoRecruiter, setInfoRecruiter] = useState({});
    const [loadRecruiter, setLoadRecruiter] = useState(true);

    useEffect(() => {
        if (!recruiter) setInfoRecruiter({});
        else getRecruiter();
    }, [recruiter])

    useEffect(() => {
        if (!candidate) setInfoCandate({});
        else getCandidate();
    }, [candidate])

    const getRecruiter = async () => {
        try {
            setLoadRecruiter(true)
            let response = await WebApiPeople.getPerson(recruiter);
            setInfoRecruiter(response.data)
            setLoadRecruiter(false)
        } catch (e) {
            console.log(e)
            setInfoRecruiter({})
            setLoadRecruiter(false)
        }
    }

    const getCandidate = async () => {
        try {
            setLoading(true)
            let response = await WebApiJobBank.getInfoCandidate(candidate);
            setInfoCandate(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setInfoCandate({})
        }
    }

    const getVacant = (id) => getValueFilter({
        value: id,
        list: list_vacancies_options,
        keyShow: 'job_position'
    })

    const getCustomer = (id) => getValueFilter({
        value: id,
        list: list_clients_options
    })

    const getName = () => `${infoCandidate?.first_name} ${infoCandidate?.last_name}`;

    const listKeys = {
        recruiter: {
            name: 'Reclutador',
            loading: loadRecruiter,
            get: (e) => Object.keys(infoRecruiter).length > 0 ? getFullName(infoRecruiter) : e
        },
        candidate: {
            name: 'Candidato',
            loading: loading,
            get: (e) => Object.keys(infoCandidate).length > 0 ? getName() : e
        },
        vacant: {
            name: 'Vacante',
            get: getVacant,
            loading: load_vacancies_options
        },
        customer: {
            name: 'Cliente',
            get: getCustomer,
            loading: load_clients_options
        }
    }

    const listData = {
        recruiter: infoRecruiter,
        candidate: infoCandidate
    }

    return {
        listKeys,
        listData
    };
}