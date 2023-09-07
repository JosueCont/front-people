import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../../libs/auth';
import MainRequets from '../../../../components/comunication/MainRequets';
import SearchRequets from '../../../../components/comunication/requets/SearchRequets';
import TableRequests from '../../../../components/comunication/requets/TableRequests';
import WebApiPeople from '../../../../api/WebApiPeople';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { getFiltersJB } from '../../../../utils/functions';

const index = ({
    currentNode
}) => {

    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastFilters, setLastFilters] = useState("");

    useEffect(() => {
        if (currentNode) {
            let filters = getFiltersJB(validFilters())
            getRequests(currentNode?.id, filters)
            setLastFilters(filters)
        }
    }, [currentNode, router.query])

    const validFilters = () => {
        let params = { ...router.query};
        params.status__in = router.query?.status__in
            ? router.query?.status__in : '1';
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
            pageKey={['holidays']}
            extraBread={[{ name: 'Vacaciones' }]}
        >
            <SearchRequets lastFilters={lastFilters}/>
            <TableRequests
                requests={requests}
                loading={loading}
            />
        </MainRequets>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    };
};

export default connect(mapState)(withAuthSync(index));