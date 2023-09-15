import { useSelector } from "react-redux";
import { genders } from "../../utils/constant";
import { getValueFilter } from "../../utils/functions";
import { getFullName } from "../../utils/functions";
import WebApiPeople from "../../api/WebApiPeople";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export const useFiltersPeople = () => {

    const {
        cat_departments,
        cat_job
    } = useSelector(state => state.catalogStore)

    const router = useRouter();
    const { immediate_supervisor } = router.query;

    const [supervisor, setSupervisor] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if(!immediate_supervisor) setSupervisor({});
        else getSupervisor();
    },[immediate_supervisor])

    const getSupervisor = async () => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getPerson(immediate_supervisor);
            setSupervisor(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setSupervisor({})
            setLoading(false)
        }
    }

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

    const getStatus = (value) => value == 'true'
        ? 'Activo' : 'Inactivo';

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
            get: (e) => Object.keys(supervisor).length > 0 ? getFullName(supervisor) : e
        },
        is_active: {
            name: 'Estatus',
            get: getStatus
        }
    }

    const listData = {
        supervisor
    }

    return {
        listKeys,
        listData
    }
}