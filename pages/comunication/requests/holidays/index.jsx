import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../../libs/auth';
import MainRequets from '../../../../components/comunication/requets/MainRequets';
import SearchRequets from '../../../../components/comunication/requets/SearchRequets';
import TableRequests from '../../../../components/comunication/requets/TableRequests';
import WebApiPeople from '../../../../api/WebApiPeople';
import { connect } from 'react-redux';
import { getPersonsCompany } from '../../../../redux/UserDuck';
import { useRouter } from 'next/router';
import { getFiltersJB } from '../../../../utils/functions';

const index = ({
    currentNode,
    getPersonsCompany
}) => {

    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentNode) {
            getPersonsCompany(currentNode?.id)
        }
    }, [currentNode])

    useEffect(() => {
        if (currentNode) {
            let filters = getFiltersJB(validFilters())
            getRequests(currentNode?.id, filters)
        }
    }, [currentNode, router.query])

    const validFilters = () =>{
        let params = {...router.query};
        if(params.range){
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
            <SearchRequets />
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

export default connect(
    mapState, {
        getPersonsCompany
    }
)(withAuthSync(index));