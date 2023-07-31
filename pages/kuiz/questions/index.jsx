import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import MainKuiz from '../../../components/kuiz/MainKuiz';
import SearchQuestions from '../../../components/kuiz/questions/SearchQuestions';
import TableSections from '../../../components/kuiz/sections/TableSections';
import { getSections } from '../../../redux/kuizDuck';
import WebApiAssessment from '../../../api/WebApiAssessment';

const index = ({
    currentNode,
    getSections
}) => {

    const router = useRouter();
    const [evaluation, setEvaluation] = useState({});
    const [section, setSection] = useState({});

    useEffect(() => {
        if (router.query?.assessment){
            // getSections(router.query?.assessment)
            getAssessment(router.query?.assessment);
        }
    }, [router.query?.assessment])

    useEffect(()=>{
        if(router.query?.section){
            getInfoSection(router.query?.section)
        }
    },[router.query?.section])

    const getAssessment = async (id) =>{
        try {
            let response = await WebApiAssessment.getDetailsAssessment(id);
            setEvaluation(response.data);
        } catch (e) {
            console.log(e)
            setEvaluation({})
        }
    }

    const getInfoSection = async (id) =>{
        try {
            let response = await WebApiAssessment.getInfoSection(id);
            setSection(response.data)
        } catch (e) {
            console.log(e)
            setSection({})
        }
    }

    const ExtraBread = [
        { name: 'Preguntas' }
    ]

    return (
        <MainKuiz
            pageKey='surveys'
            extraBread={ExtraBread}
        >
            <SearchQuestions
                evaluation={evaluation}
                section={section}
            />
            {/* <TableSections /> */}
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