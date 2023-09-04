import { useSelector } from 'react-redux';
import { getValueFilter } from '../../../../utils/functions';

export const useFiltersPlaces = () => {

    const {
        list_org_nodes_options,
        load_org_nodes_options,
        list_jobs_options,
        load_jobs_options,
        list_ranks_options,
        load_ranks_options,
        list_places_options,
        load_places_options
    } = useSelector(state => state.orgStore);

    const getNode = (id) => getValueFilter({
        value: id,
        list: list_org_nodes_options
    })

    const getJob = (id) => getValueFilter({
        value: id,
        list: list_jobs_options
    })

    const getRank = (id) => getValueFilter({
        value: id,
        list: list_ranks_options
    })

    const getPlace = (id) => getValueFilter({
        value: id,
        list: list_places_options
    })

    const listKeys = {
        name__unaccent__icontains: {
            name: 'Nombre'
        },
        description__unaccent__icontains: {
            name: 'Descripción'
        },
        is_active: {
            name: 'Estatus',
            get: e => e == 'all' ? 'Todos'
                : e == 'true' ? 'Activo' : 'Inactivo'
        },
        organizational_node: {
            name: 'Nodo organizacional',
            loading: load_org_nodes_options,
            get: getNode
        },
        job: {
            name: 'Puesto de trabajo',
            loading: load_jobs_options,
            get: getJob
        },
        hierarchical_level: {
            name: 'Nivel jerárquico',
            loading: load_ranks_options,
            get: getRank
        },
        position_report: {
            name: 'Plaza a la que reporta',
            loading: load_places_options,
            get: getPlace
        }
    }

    return {
        listKeys
    }
}