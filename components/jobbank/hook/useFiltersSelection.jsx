import { useSelector } from "react-redux";
import { optionsStatusSelection } from "../../../utils/constant";

export const useFiltersSelection = () =>{

    const {
        list_vacancies_options,
        load_vacancies_options
    } = useSelector(state => state.jobBankStore);

    const listKeys = {
        name: 'Nombre',
        lastname: 'Apellidos',
        email: 'Correo',
        phone: 'Teléfono',
        status: 'Estatus',
        vacant: 'Vacante'
    }

    const getStatus = (value) => {
        if(!value) return value;
        const find_ = item => item.value == value;
        let result = optionsStatusSelection.find(find_);
        if(!result) return value;
        return result.label;
    }

    const getVacant = (id) =>{
        if(!id) return id;
        const find_ = item => item.id == id;
        let result = list_vacancies_options.find(find_);
        if(!result) return id;
        return result.job_position;
    }

    const listGets = {
        status: getStatus,
        vacant: getVacant
    }

    return { listKeys, listGets };
}