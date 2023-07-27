import { useSelector, useDispatch } from "react-redux";
import { genders } from "../../utils/constant";
import { getValueFilter } from "../../utils/functions";
import { getFullName } from "../../utils/functions";
import { setUserFiltersData } from "../../redux/UserDuck";
import WebApiPeople from "../../api/WebApiPeople";

export const useFiltersPeople = () => {

    const {
        cat_departments,
        cat_job
    } = useSelector(state => state.catalogStore)

    const dispatch = useDispatch();

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

    const getSupervisor = async (id, key) => {
        try {
            let response = await WebApiPeople.getPerson(id);
            let value = { [key]: response.data };
            dispatch(setUserFiltersData(value));
            return getFullName(response.data);
        } catch (e) {
            console.log(e)
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

    const listGets = {
        gender: getGender,
        department: getDepartment,
        job: getJob,
        is_active: getStatus
    }

    const listDelete = {
        immediate_supervisor: deleteState
    }

    return {
        listKeys,
        listGets,
        listAwait,
        listDelete
    }
}