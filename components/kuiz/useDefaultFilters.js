import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import WebApiAssessment from '../../api/WebApiAssessment';

export const useDefaultFilters = () => {

    const router = useRouter();
    const [assessment, setAssessment] = useState({});
    const [section, setSection] = useState({});
    const [question, setQuestion] = useState({});

    useEffect(() => {
        let key = router.query?.assessment;
        if (key) getAssessment(key);
    }, [router.query?.assessment])

    useEffect(() => {
        let key = router.query?.section;
        if (key) getSection(key);
    }, [router.query?.section])

    useEffect(() => {
        let key = router.query?.question;
        if (key) getQuestion(key);
    }, [router.query?.question])

    const getAssessment = async (id) => {
        try {
            let response = await WebApiAssessment.getDetailsAssessment(id);
            setAssessment(response.data);
        } catch (e) {
            console.log(e)
            setAssessment({})
        }
    }

    const getSection = async (id) => {
        try {
            let response = await WebApiAssessment.getInfoSection(id);
            setSection(response.data)
        } catch (e) {
            console.log(e)
            setSection({})
        }
    }

    const getQuestion = async (id) => {
        try {
            let response = await WebApiAssessment.getInfoQuestion(id);
            setQuestion(response.data)
        } catch (e) {
            console.log(e)
            setQuestion({})
        }
    }

    const filters = useMemo(() => {
        let filters_ = {};
        let name = assessment?.name;
        let name_ = section?.name;
        let title = question?.title;
        if (name) filters_['Evaluación'] = name;
        if (name_) filters_['Sección'] = name_;
        if (title) filters_['Pregunta'] = title;
        return filters_;
    }, [assessment, section, question])

    return filters
}