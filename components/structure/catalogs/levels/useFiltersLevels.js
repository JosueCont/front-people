import { useSelector } from 'react-redux';
import { getValueFilter } from '../../../../utils/functions';

export const useFiltersLevels = () => {

    const {
        list_org_levels_options,
        load_org_levels_options
    } = useSelector(state => state.orgStore);

    const getParent = (id) => getValueFilter({
        value: id,
        list: list_org_levels_options
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
        parent: {
            name: 'Precede',
            loading: load_org_levels_options,
            get: getParent
        }
    }

    return {
        listKeys
    }
}