import { useSelector, useDispatch } from "react-redux";
import { optionsStatusSelection } from "../../../utils/constant";
import { getValueFilter } from "../../../utils/functions";
import WebApiJobBank from "../../../api/WebApiJobBank";
import { setJobbankFiltersData } from "../../../redux/jobBankDuck";

export const useFiltersSelection = () => {

    const {
        list_vacancies_options,
        load_vacancies_options,
    } = useSelector(state => state.jobBankStore);
    const dispatch = useDispatch();

    const listKeys = {
        status_process: 'Estatus',
        vacant: 'Vacante',
        candidate: 'Candidato'
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

    const getCandidate = async (id, key) =>{
        try {
            let response = await WebApiJobBank.getInfoCandidate(id);
            let value = {[key]: response.data};
            dispatch(setJobbankFiltersData(value));
            return `${response.data?.first_name} ${response.data?.last_name}`;
        } catch (e) {
            console.log(e)
            return id;
        }
    }

    const deleteState = (key) =>{
        dispatch(setJobbankFiltersData({[key] : null}))
    }

    const listGets = {
        status_process: getStatus,
        vacant: getVacant
    }

    const listAwait = {
        candidate: getCandidate
    }

    const listDelete = {
        candidate: deleteState
    }

    return {
        listKeys,
        listGets,
        listAwait,
        listDelete
    };
}