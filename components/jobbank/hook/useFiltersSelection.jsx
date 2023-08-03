import { useSelector, useDispatch } from "react-redux";
import { optionsStatusSelection } from "../../../utils/constant";
import { getValueFilter } from "../../../utils/functions";
import WebApiJobBank from "../../../api/WebApiJobBank";
import { setJobbankFiltersData } from "../../../redux/jobBankDuck";
import { useState } from "react";

export const useFiltersSelection = () => {

    const {
        list_vacancies_options,
        load_vacancies_options,
    } = useSelector(state => state.jobBankStore);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

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

    const getCandidate = async (id, key) =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getInfoCandidate(id);
            let value = {[key]: response.data};
            dispatch(setJobbankFiltersData(value));
            setLoading(false)
            return `${response.data?.first_name} ${response.data?.last_name}`;
        } catch (e) {
            console.log(e)
            setLoading(false)
            return id;
        }
    }

    const deleteState = (key) =>{
        dispatch(setJobbankFiltersData({[key] : null}))
    }

    const listAwait = {
        candidate: getCandidate
    }

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
            delete: deleteState
        }
    }

    return {
        listKeys,
        listAwait
    };
}