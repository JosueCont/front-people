import { useSelector, useDispatch } from "react-redux";
import { genders } from "../../utils/constant";
import { getValueFilter } from "../../utils/functions";
import { getFullName } from "../../utils/functions";
import { setUserFiltersData } from "../../redux/UserDuck";
import WebApiPeople from "../../api/WebApiPeople";
import { useState } from "react";

export const useFiltersPeople = () => {

    const {
        cat_departments,
        cat_job
    } = useSelector(state => state.catalogStore)

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const getGender = (value) => getValueFilter({
        value,
        list: genders,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getDepartment = (id) => getValueFilter({
        value: id,
        list: cat_departments
    })

    const getJob = (id) => getValueFilter({
        value: id,
        list: cat_job
    })

    const getSupervisor = async (id, key) => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getPerson(id);
            let value = { [key]: response.data };
            dispatch(setUserFiltersData(value));
            setLoading(false)
            return getFullName(response.data);
        } catch (e) {
            console.log(e)
            setLoading(false)
            return id;
        }
    }

    const getStatus = (value) => value == 'true'
        ? 'Activos' : 'Inactivos';

    const deleteState = (key) => {
        dispatch(setUserFiltersData({ [key]: null }))
    }

    const listAwait = {
        immediate_supervisor: getSupervisor,
    }

    const listKeys = {
        first_name__icontains: {
            name: 'Nombre'
        },
        flast_name__icontains: {
            name: 'Apellido paterno'
        },
        mlast_name__icontains: {
            name: 'Apellido materno'
        },
        code__icontains: {
            name: 'No. empleado'
        },
        gender: {
            name: 'Género',
            get: getGender
        },
        department: {
            name: 'Departamento',
            get: getDepartment
        },
        job: {
            name: 'Puesto',
            get: getJob
        },
        immediate_supervisor: {
            name: 'Jefe inmediato',
            loading: loading,
            delete: deleteState
        },
        is_active: {
            name: 'Estatus',
            get: getStatus
        }
    }

    return {
        listKeys,
        listAwait
    }
}