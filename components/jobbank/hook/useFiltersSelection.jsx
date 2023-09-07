import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { optionsStatusSelection } from "../../../utils/constant";
import { getValueFilter } from "../../../utils/functions";
import WebApiJobBank from "../../../api/WebApiJobBank";
import { useRouter } from "next/router";

export const useFiltersSelection = () => {

    const {
        list_vacancies_options,
        load_vacancies_options,
    } = useSelector(state => state.jobBankStore);

    const router = useRouter();
    const { candidate } = router.query;

    const [loading, setLoading] = useState(false);
    const [infoCandidate, setInfoCandidate] = useState({});

    useEffect(() => {
        if (!candidate) setInfoCandidate({});
        else getCandidate();
    }, [candidate])

    const getCandidate = async () => {
        try {
            setLoading(true)
            let response = await WebApiJobBank.getInfoCandidate(candidate);
            setInfoCandidate(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setInfoCandidate({})
        }
    }

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusSelection,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getVacant = (id) => getValueFilter({
        value: id,
        list: list_vacancies_options,
        keyShow: 'job_position'
    })

    const getName = () => `${infoCandidate?.first_name} ${infoCandidate?.last_name}`;

    const listKeys = {
        status_process: {
            name: 'Estatus',
            get: getStatus
        },
        vacant: {
            name: 'Vacante',
            get: getVacant,
            loading: load_vacancies_options
        },
        candidate: {
            name: 'Candidato',
            loading: loading,
            get: (e) => Object.keys(infoCandidate).length > 0 ? getName() : e
        }
    }

    const listData = {
        candidate: infoCandidate
    }

    return {
        listKeys,
        listData
    };
}