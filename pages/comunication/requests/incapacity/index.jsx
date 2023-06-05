import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { withAuthSync } from '../../../../libs/auth';
import { getPersonsCompany } from '../../../../redux/UserDuck';
import MainRequets from '../../../../components/comunication/MainRequets';
import WebApiPeople from '../../../../api/WebApiPeople';
import SearchIncapacity from '../../../../components/comunication/inpacity/SearchIncapacity';
import TableIncapacity from '../../../../components/comunication/inpacity/TableIncapacity';
import { getFiltersJB } from '../../../../utils/functions';

const index = ({
    currentNode,
    getPersonsCompany
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [disabilities, setDisabilities] = useState([]);

    useEffect(() => {
        if (!currentNode) return;
        let filters = getFiltersJB({...router.query});
        getDisabilities(currentNode?.id, filters)
    }, [currentNode, router.query])

    useEffect(() => {
        if (!currentNode) return;
        getPersonsCompany(currentNode?.id)
    }, [currentNode])

    const getDisabilities = async (node, query = '') => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getDisabilitiesRequest(node, query);
            setDisabilities(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setDisabilities([])
        }
    }

    return (
        <MainRequets
            pageKey={['incapacity']}
            extraBread={[{ name: 'Incapacidad' }]}
        >
            <SearchIncapacity/>
            <TableIncapacity
                loading={loading}
                disabilities={disabilities}
            />
        </MainRequets>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {
    getPersonsCompany
}
)(withAuthSync(index))