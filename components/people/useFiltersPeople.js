import { useSelector } from "react-redux"
import { genders } from "../../utils/constant"
import { getValueFilter } from "../../utils/functions"
import { getFullName } from "../../utils/functions"

export const useFiltersPeople = () =>{

    const {
        cat_departments,
        cat_job
    } = useSelector(state => state.catalogStore)
    const {
        load_persons,
        persons_company
    } = useSelector(state => state.userStore)

    const listKeys = {
        first_name__icontains: 'Nombre',
        flast_name__icontains: 'Apellido paterno',
        mlast_name__icontains: 'Apellido materno',
        code__icontains: 'No. empleado',
        gender: 'Género',
        department: 'Departamento',
        job: 'Puesto',
        immediate_supervisor: 'Jefe inmediato',
        is_active: 'Estatus'
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

    const getSupervisor = (id) => getValueFilter({
        value: id,
        list: persons_company,
        keyShow: e => getFullName(e)
    })

    const getStatus = (value) => value == 'true'
        ? 'Activos' : 'Inactivos' 

    const listGets = {
        gender: getGender,
        department: getDepartment,
        job: getJob,
        immediate_supervisor: getSupervisor,
        is_active: getStatus
    }

    return { listKeys, listGets }
}