import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import {
    getClientsOptions,
    getVacanciesOptions,
    getJobBoards
} from '../../../redux/jobBankDuck';
import DetailsStrategies from './DetailsStrategies';
import { deleteFiltersJb } from '../../../utils/functions';
import MainIndexJB from '../MainIndexJB';

const AddOrEditStrategies = ({
    action = 'add',
    currentNode,
    getClientsOptions,
    getVacanciesOptions,
    getJobBoards
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id', 'client', 'back'];

    useEffect(() => {
        if (Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    }, [router.query])

    useEffect(() => {
        if (currentNode) {
            getClientsOptions(currentNode.id);
            getVacanciesOptions(currentNode.id, '&status=1&has_strategy=0');
            getJobBoards(currentNode.id);
        }
    }, [currentNode])

    const ExtraBread = [
        { name: 'Estrategias', URL: '/jobbank/strategies' },
        { name: action == 'add' ? 'Nueva' : 'Expediente' }
    ]

    return (
        <MainIndexJB
            pageKey='jb_strategies'
            extraBread={ExtraBread}
            newFilters={newFilters}
        >
            <DetailsStrategies
                action={action}
                newFilters={newFilters}
            />
        </MainIndexJB>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        getClientsOptions,
        getVacanciesOptions,
        getJobBoards
    }
)(AddOrEditStrategies);