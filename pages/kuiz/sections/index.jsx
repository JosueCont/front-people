import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import MainKuiz from '../../../components/kuiz/MainKuiz';
import SearchSections from '../../../components/kuiz/sections/SearchSections';
import TableSections from '../../../components/kuiz/sections/TableSections';
import { getSections } from '../../../redux/kuizDuck';
import WebApiAssessment from '../../../api/WebApiAssessment';

const index = ({
    currentNode,
    getSections
}) => {

    const router = useRouter();
    const [evaluation, setEvaluation] = useState({});

    useEffect(() => {
        if (router.query?.assessment){
            getSections(router.query?.assessment)
            getAssessment(router.query?.assessment);
        }
    }, [router.query?.assessment])

    const getAssessment = async (id) =>{
        try {
            let response = await WebApiAssessment.getDetailsAssessment(id);
            setEvaluation(response.data);
        } catch (e) {
            console.log(e)
            setEvaluation({})
        }
    }

    const ExtraBread = [
        { name: 'Secciones' }
    ]

    return (
        <MainKuiz
            pageKey='surveys'
            extraBread={ExtraBread}
        >
            <SearchSections evaluation={evaluation}/>
            <TableSections />
        </MainKuiz>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {
        getSections
    }
)(withAuthSync(index));