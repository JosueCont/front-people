import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../../libs/auth';
import { getPersonsCompany } from '../../../../redux/UserDuck';
import MainRequets from '../../../../components/comunication/MainRequets';
import WebApiPeople from '../../../../api/WebApiPeople';

const index = ({
    currentNode,
    getPersonsCompany
}) => {

    const [loading, setLoading] = useState(false);
    const [disabilities, setDisabilities] = useState([]);

    useEffect(()=>{
        if(!currentNode) return;
        getDisabilities(currentNode?.id)
    },[currentNode])

    const getDisabilities = async (node, query = '') =>{
        try {
            setLoading(true)
            let response = await WebApiPeople.getDisabilitiesRequest(node, query);
            console.log("🚀 ~ file: copy.jsx:25 ~ getDisabilities ~ response:", response)
            setLoading(false)
            setDisabilities([])
        } catch (e) {
            console.log(e)
            setLoading(false)
            setDisabilities([])
        }
    }

    return (
        <MainRequets
            pageKey={['incapacity']}
            extraBread={[{name: 'Incapacidad'}]}
        >

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