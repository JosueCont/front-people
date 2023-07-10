import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { withAuthSync } from '../../../../libs/auth';
import MainRequets from '../../../../components/comunication/MainRequets';
import WebApiPeople from '../../../../api/WebApiPeople';
import { getFiltersJB } from '../../../../utils/functions';
import SearchRequests from '../../../../components/comunication/requets/SearchRequets';
import TableRequests from '../../../../components/comunication/requets/TableRequests';

const index = ({
    currentUser,
    currentNode
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState([]);
    const [lastFilters, setLastFilters] = useState("");

    useEffect(() => {
        if(!currentNode || !currentUser) return;
        let filters = getFiltersJB(validFilters())
        getRequests(currentNode?.id, filters)
        setLastFilters(filters)
    }, [currentNode, router.query])

    const validFilters = () => {
        let params = { ...router.query};
        params.status__in = router.query?.status__in
            ? router.query?.status__in : '1';
        params.person__id = currentUser?.id;
        if (params?.status__in?.includes('6')) delete params.status__in;
        if (params.range) {
            let dates = params.range.split(',');
            params.start_date_filter = dates[0];
            params.end_date_filter = dates[1];
            delete params.range;
        }
        return params;
    }

    const getRequests = async (node, query = '') => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getVacationRequest(node, query);
            setRequests(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    return (
        <MainRequets
            isAdmin={false}
            pageKey={['holidays']}
            extraBread={[{ name: 'Vacaciones' }]}
        >
            <SearchRequests
                lastFilters={lastFilters}
                currentURL='/user/requests/holidays'
                isAdmin={false}
            />
            <TableRequests
                requests={requests}
                loading={loading}
            />
        </MainRequets>
    )
}

const mapState = (state) => {
    return {
        currentUser: state.userStore.user,
        currentNode: state.userStore.current_node
    };
};

export default connect(
    mapState, {

}
)(withAuthSync(index));