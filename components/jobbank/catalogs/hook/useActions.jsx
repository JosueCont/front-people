import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import WebApiJobBank from "../../../../api/WebApiJobBank";
import {
    getMainCategories,
    getSubCategories,
    getAcademics,
    getCompetences,
    getProfilesTypes,
    getSectors
} from '../../../../redux/jobBankDuck';

export const useActions = () =>{

    const dispatch = useDispatch();
    const currentNode = useSelector(state => state.userStore.current_node);

    const createProfileType = async (values) =>{
        try {
            await WebApiJobBank.createProfileType(values);
            dispatch(getProfilesTypes(currentNode.id));
            message.success('Perfil registrado');
        } catch (e) {
            console.log(e)
            message.error('Perfil no registrado');
        }
    }

    const updateProfileType = async (id, values) =>{
        try {
            await WebApiJobBank.updateProfileType(id, values);
            dispatch(getProfilesTypes(currentNode.id));
            message.success('Perfil actcualizado');
        } catch (e) {
            console.log(e)
            message.error('Perfil no registrado');
        }
    }

    const deleteProfileType = async (id) =>{
        try {
            await WebApiJobBank.deleteProfileType(id);
            dispatch(getProfilesTypes(currentNode.id));
            message.success('Perfil eliminado');
        } catch (e) {
            console.log(e)
            message.error('Perfil no eliminado');
        }
    }

    const listKeysCatalog = {
        profiles: {
            data: 'list_profiles_types',
            load: 'load_profiles_types',
            titleBread: 'Perfiles template',
            titleModal: 'perfil template',
            getAction: getProfilesTypes,
            deleteAction: deleteProfileType
        },
    };

    return { listKeysCatalog };

}