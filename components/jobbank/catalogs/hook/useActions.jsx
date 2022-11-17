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

    const createMainCategory = async (values) =>{
        try {
            await WebApiJobBank.createMainCategoy({...values, node: currentNode.id});
            dispatch(getMainCategories(currentNode.id));
            message.success('Categoría registrada');
        } catch (e) {
            console.log(e)
            message.error('Categoría no registrada');
        }
    }

    const updateMainCategory = async (id, values) =>{
        try {
            await WebApiJobBank.updateMainCategory(id, values);
            dispatch(getMainCategories(currentNode.id));
            message.success('Categoría actualizada');
        } catch (e) {
            console.log(e)
            message.error('Categoría no actualizada');
        }
    }

    const deleteMainCategory = async (id) =>{
        try {
            await WebApiJobBank.deleteMainCategory(id);
            dispatch(getMainCategories(currentNode.id));
            message.success('Categoría eliminada');
        } catch (e) {
            console.log(e)
            message.error('Categoría no eliminada')
        }
    }

    const createSubCategory = async (values) =>{
        try {
            await WebApiJobBank.createSubCategory(values);
            dispatch(getSubCategories(currentNode.id));
            message.success('Subcategorái registrada');
        } catch (e) {
            console.log(e)
            message.error('Subcategoría no registrada');
        }
    }

    const updateSubCategory = async (id, values) =>{
        try {
            await WebApiJobBank.updateSubCategory(id, values);
            dispatch(getSubCategories(currentNode.id));
            message.success('Subcategorái actualizada');
        } catch (e) {
            console.log(e)
            message.error('Subcategoría no actualizada');
        }
    }

    const deleteSubCategory = async (id) =>{
        try {
            await WebApiJobBank.deleteSubCategory(id);
            dispatch(getSubCategories(currentNode.id));
            message.success('Subcategoría eliminada');
        } catch (e) {
            console.log(e)
            message.error('Subcategoría no eliminada');
        }
    }

    const createAcademic = async (values) =>{
        try {
            await WebApiJobBank.createAcademic(values);
            dispatch(getAcademics(currentNode.id));
            message.success('Carrera registrada');
        } catch (e) {
            console.log(e)
            message.error('Carrera no registrada');
        }
    }

    const updateAcademic = async (id, values) =>{
        try {
            await WebApiJobBank.updateAcademic(id, values);
            dispatch(getAcademics(currentNode.id));
            message.success('Carrera actualizada');
        } catch (e) {
            console.log(e)
            message.error('Carrera no actualizada');
        }
    }

    const deleteAcademic = async (id) =>{
        try {
            await WebApiJobBank.deleteAcademic(id);
            dispatch(getAcademics(currentNode.id));
            message.success('Carrera eliminada')
        } catch (e) {
            console.log(e)
            message.error('Carrera no eliminada')
        }
    }

    const createCompetence = async (values) =>{
        try {
            await WebApiJobBank.createCompetence(values);
            dispatch(getCompetences(currentNode.id));
            message.success('Competencia registrada');
        } catch (e) {
            console.log(e)
            message.error('Competencia no registrada');
        }
    }

    const updateCompetence = async (id, values) =>{
        try {
            await WebApiJobBank.updateCompetence(id, values);
            dispatch(getCompetences(currentNode.id));
            message.success('Competencia actuailzada')
        } catch (e) {
            console.log(e)
            message.error('Competencia no actualizada');
        }
    }

    const deleteCompetence = async (id) =>{
        try {
            await WebApiJobBank.deleteCompetence(id);
            dispatch(getCompetences(currentNode.id));
            message.success('Competencia eliminada');
        } catch (e) {
            console.log(e)
            message.error('Competencia no eliminada');
        }
    }

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

    const createSector = async (values) =>{
        try {
            await WebApiJobBank.createSector(values);
            dispatch(getSectors(currentNode.id));
            message.success('Sector registrado');
        } catch (e) {
            console.log(e)
            message.error('Sector no registrado');
        }
    }

    const updateSector = async (id, values) =>{
        try {
            await WebApiJobBank.updateSector(id, values);
            dispatch(getSectors(currentNode.id));
            message.success('Sector actualizado');
        } catch (e) {
            console.log(e)
            message.error('Sector no actualizado');
        }
    }

    const deleteSector = async (id) =>{
        try {
            await WebApiJobBank.deleteSector(id);
            dispatch(getSectors(currentNode.id));
            message.success('Sector eliminado');
        } catch (e) {
            console.log(e)
            message.error('Sector no eliminado');
        }
    }

    const listKeysCatalog = {
        categories: {
            data: 'list_main_categories',
            load: 'load_main_categories',
            titleBread: 'Categorías',
            titleModal: 'categoría',
            getAction: getMainCategories,
            createAction: createMainCategory,
            updateAction: updateMainCategory,
            deleteAction: deleteMainCategory
        },
        academic: {
            data: 'list_academics',
            load: 'load_academics',
            titleBread: 'Carreras',
            titleModal: 'carrera',
            getAction: getAcademics,
            createAction: createAcademic,
            updateAction: updateAcademic,
            deleteAction: deleteAcademic
        },
        competences: {
            data: 'list_competences',
            load: 'load_competences',
            titleBread: 'Competencias',
            titleModal: 'competencia',
            getAction: getCompetences,
            createAction: createCompetence,
            updateAction: updateCompetence,
            deleteAction: deleteCompetence
        },
        profiles: {
            data: 'list_profiles_types',
            load: 'load_profiles_types',
            titleBread: 'Perfiles template',
            titleModal: 'perfil template',
            getAction: getProfilesTypes,
            deleteAction: deleteProfileType
        },
        sectors: {
            data: 'list_sectors',
            load: 'load_sectors',
            titleBread: 'Sectores',
            titleModal: 'sector',
            getAction: getSectors,
            createAction: createSector,
            updateAction: updateSector,
            deleteAction: deleteSector
        },
        subcategories: {
            data: 'list_sub_categories',
            load: 'load_sub_categories',
            titleBread: 'Subcategorías',
            titleModal: 'subcategoría',
            getAction: (node) =>{
                dispatch(getMainCategories(node));
                dispatch(getSubCategories(node));
            },
            createAction: createSubCategory,
            updateAction: updateSubCategory,
            deleteAction: deleteSubCategory
        }
    };

    return { listKeysCatalog };

}