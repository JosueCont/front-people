import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { optionsStatusApplications } from "../../../utils/constant";
import { getValueFilter } from "../../../utils/functions";
import WebApiJobBank from "../../../api/WebApiJobBank";
import { useRouter } from "next/router";
import moment from "moment";

export const useFiltersApplications = () => {

    const {
        list_vacancies_options,
        load_vacancies_options,
        list_clients_options,
        load_clients_options
    } = useSelector(state => state.jobBankStore);

    const router = useRouter();
    const { candidate } = router.query;

    const [loading, setLoading] = useState(true);
    const [infoCandidate, setInfoCandidate] = useState({});

    const format = 'DD-MM-YYYY';

    useEffect(()=>{
        if(!candidate) setInfoCandidate({});
        else getCandidate();
    },[candidate])

    const getCandidate = async () => {
        try {
            setLoading(true)
            let response = await WebApiJobBank.getInfoCandidate(candidate);
            setInfoCandidate(response.data);
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setInfoCandidate({})
        }
    }

    const getCustomer = (id) => getValueFilter({
        value: id,
        list: list_clients_options
    })

    const getVacant = (id) => getValueFilter({
        value: id,
        list: list_vacancies_options,
        keyShow: 'job_position'
    })

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusApplications,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getDate = (value) => {
        let dates = value.split(',');
        let start = moment(dates[0], 'YYYY-MM-DD').format(format);
        let end = moment(dates[1], 'YYYY-MM-DD').format(format);
        return `${start} - ${end}`;
    }

    const getName = () => `${infoCandidate?.first_name} ${infoCandidate?.last_name}`;

    const listKeys = {
        candidate: {
            name: 'Candidato',
            loading: loading,
            get: (e) => Object.keys(infoCandidate).length > 0 ? getName() : e
        },
        vacant__customer: {
            name: 'Cliente',
            get: getCustomer,
            loading: load_clients_options
        },
        vacant: {
            name: 'Vacante',
            get: getVacant,
            loading: load_vacancies_options
        },
        status: {
            name: 'Estatus',
            get: getStatus
        },
        date: {
            name: 'Fecha',
            get: getDate
        },
    }

    const listData = {
        candidate: infoCandidate
    }

    return {
        listKeys,
        listData
    }
}