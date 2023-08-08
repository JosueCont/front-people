import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import MainKuiz from '../../../components/kuiz/MainKuiz';
import SearchQuestions from '../../../components/kuiz/questions/SearchQuestions';
import TableQuestions from '../../../components/kuiz/questions/TableQuestions';
import { getQuestions } from '../../../redux/kuizDuck';
import WebApiAssessment from '../../../api/WebApiAssessment';

const index = ({
    currentNode,
    getQuestions
}) => {

    const router = useRouter();
    const [evaluation, setEvaluation] = useState({});
    const [section, setSection] = useState({});

    useEffect(() => {
        if (router.query?.assessment){
            getAssessment(router.query?.assessment);
        }
    }, [router.query?.assessment])

    useEffect(()=>{
        if(router.query?.section){
            getInfoSection(router.query?.section)
            getQuestions(router.query?.section)
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
            <TableQuestions/>
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
        getQuestions
}
)(withAuthSync(index));