import React, {
    useEffect,
    useState
} from 'react';
import MainKuiz from '../MainKuiz';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import DetailsAssessment from './DetailsAssessment';
import { getCategories } from '../../../redux/kuizDuck';
import { deleteFiltersJb } from '../../../utils/functions';

const AddOrEditAssessment = ({
    action = 'add',
    currentNode,
    getCategories,
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id'];

    useEffect(() => {
        if (Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    }, [router.query])

    useEffect(()=>{
        if(!currentNode) return;
        getCategories(currentNode?.id)
    },[currentNode])

    const ExtraBread = [
        { name: 'Evaluaciones', URL: '/kuiz/assessments' },
        { name: action == 'add' ? 'Registrar' : 'Editar' }
    ]

    return (
        <MainKuiz
            pageKey='surveys'
            extraBread={ExtraBread}
            newFilters={newFilters}
        >
            <DetailsAssessment
                action={action}
                newFilters={newFilters}
            />
        </MainKuiz>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
    getCategories
}
)(AddOrEditAssessment)