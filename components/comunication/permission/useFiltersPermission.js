import { useState } from "react";
import { optionsStatusPermits } from "../../../utils/constant";
import { getValueFilter, getFullName } from "../../../utils/functions";
import { useSelector, useDispatch } from "react-redux";
import WebApiPeople from "../../../api/WebApiPeople";
import { setUserFiltersData } from "../../../redux/UserDuck";

export const useFiltersPermission = () =>{
    
    const {
        cat_departments
    } = useSelector(state => state.catalogStore);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    
    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusPermits,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getPerson = async (id, key) => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getPerson(id);
            let value = {[key]: response.data};
            dispatch(setUserFiltersData(value))
            setLoading(false)
            return getFullName(response.data);
        } catch (e) {
            console.log(e)
            setLoading(false)
            return id;
        }
    }

    const deleteState = (key) =>{
        dispatch(setUserFiltersData({[key] : null}))
    }

    const getDeparment = (id) => getValueFilter({
        value: id,
        list: cat_departments
    })

    const listAwait = {
        person__id: getPerson
    }

    const listKeys = {
        person__id: {
            name: 'Colaborador',
            loading: loading,
            delete: deleteState
        },
        status: {
            name: 'Estatus',
            get: getStatus
        },
        department__id:{
            name: 'Departamento',
            get: getDeparment
        }
    }

    return { listKeys, listAwait }
}