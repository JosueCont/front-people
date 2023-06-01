import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../../libs/auth';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import MainRequets from '../../../../components/comunication/MainRequets';
import SearchPermission from '../../../../components/comunication/permission/SearchPermission';
import TablePermission from '../../../../components/comunication/permission/TablePermission';
import WebApiPeople from '../../../../api/WebApiPeople';
import { getPersonsCompany } from '../../../../redux/UserDuck';
import { getFiltersJB } from '../../../../utils/functions';

const index = ({
    currentNode,
    getPersonsCompany
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [permits, setPermits] = useState([]);

    useEffect(()=>{
        if(!currentNode) return;
        let filters = getFiltersJB({...router.query});
        getListPermissions(currentNode?.id, filters);
    },[currentNode, router.query])

    useEffect(()=>{
        if(!currentNode) return;
        getPersonsCompany(currentNode?.id)
    },[currentNode])

    const getListPermissions = async (node, query = '') =>{
        try {
            setLoading(true)
            let response = await WebApiPeople.getPermitsRequest(node, query);
            setPermits(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setPermits([])
        }
    }

    return (
        <MainRequets
            pageKey={["permission"]}
            extraBread={[{ name: 'Permisos' }]}
        >
            <SearchPermission />
            <TablePermission
                loading={loading}
                permits={permits}
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