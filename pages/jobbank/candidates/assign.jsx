import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';
import SearchAssign from '../../../components/jobbank/candidates/assign/SearchAssign';
import TableAssign from '../../../components/jobbank/candidates/assign/TableAssign';
import WebApiAssessment from '../../../api/WebApiAssessment';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { CustomProvider } from '../../../components/jobbank/context/CustomContext';
import { valueToFilter } from '../../../utils/functions';
import moment from 'moment';
import { deleteFiltersJb } from '../../../utils/functions';
import WebApiPeople from '../../../api/WebApiPeople';

const assign = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [evaluations, setEvaluations] = useState([]);
    const [allEvaluations, setAllEvaluations] = useState([]);
    const [newFilters, setNewFilters] = useState({});
    const [infoCandidate, setInfoCandidate] = useState({});
    const keepKeys = ['name_assessment','status_apply','date_finish'];
    const deleteKeys = ['person','back'];
    const formatFilter = "DD-MM-YYYY";
    const watchQuerys = [
        router.query?.name_assessment,
        router.query?.status_apply,
        router.query?.date_finish,
        router.query?.person
    ];

    useEffect(() => {
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys.concat(keepKeys));
        setNewFilters(filters);
        if(!router.query?.person) return;
        getEvaluations(router.query?.person)
    }, [...watchQuerys])

    useEffect(()=>{
        if(!router.query?.person) return;
        getPerson(router.query?.person);
    },[router.query?.person])

    // useEffect(()=>{
    //     if(!router.query?.id) return;
    //     getCandidate(router.query?.id);
    // },[router.query?.id])

    const getEvaluations = async (id) =>{
        try {
            setLoading(true)
            let response = await WebApiAssessment.getUserListAssessments({person: id});
            let formatted = formatData(response.data);
            let results = onFilterEvaluations(formatted);
            setEvaluations(orderData(results))
            setAllEvaluations(formatted)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const getPerson = async (id) =>{
        try {
            let response = await WebApiPeople.getPerson(id);
            setInfoCandidate(response.data)
        } catch (e) {
            console.log(e)
        }
    }

    // const getCandidate = async (id) =>{
    //     try {
    //         let response = await WebApiJobBank.getInfoCandidate(id);
    //         setInfoCandidate(response.data)            
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    const getValues = (current) =>{
        return{
            id: current.id,
            name: current.name,
            code: current.code,
            applys: current.applys,
            groups: current.group ? [current.group] : [],
            origins: current.origin ? [current.origin] : []
        }
    }

    const formatData = (response) =>{
        return response.reduce((acc, current) =>{
            const some_ = item => item.code == current.code;
            let exist = acc.some(some_);
            if(!exist) return [...acc, getValues(current)];
            return acc.map(item => {
                if(item.code != current.code) return item;
                let groups = current.group
                    ? [...item.groups, current.group]
                    : item.groups;
                let origins = current.origin
                    ? [...item.origins, current.origin]
                    : item.origins;
                return {...item, origins, groups};
            });
        },[])
    }

    const orderData = (data) =>{
        return data.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        })
    }

    const existName = (item, name) => name && valueToFilter(item.name).includes(valueToFilter(name));
    const existDate = (item, date) =>{
        let end_date = item.applys[0]?.end_date;
        return end_date && moment(end_date).format(formatFilter) == date;
    }
    const existStatus = (item, status) =>{
        let status_apply = item.applys[0]?.status;
        return item.applys?.length > 0
            ? status_apply == status
            : status == 3; 
    }

    const searchByFilters = (response, size) =>{
        let name = router.query?.name_assessment;
        let status = router.query?.status_apply;
        let date = router.query?.date_finish ?? null;
        return response.filter(item =>{
            let exist_name = existName(item, name);
            let exist_date = existDate(item, date);
            let exist_status = existStatus(item, status);
            if(size == 1) return exist_name || exist_date || exist_status;
            if(size == 2) return (exist_name && exist_date)
                || (exist_name && exist_status)
                || (exist_date && exist_status);
            return exist_name && exist_date && exist_status;
        })
    }

    const onFilterEvaluations = (response) =>{
        let keys = Object.keys(router.query);
        const filter_ = item => keepKeys.includes(item);
        let filters = keys.filter(filter_);
        if(filters.length <= 0) return response;
        return searchByFilters(response, filters.length);
    }

    const ExtraBread = [
        {name: 'Candidatos', URL: '/jobbank/candidates'},
        {name: 'Evaluaciones'}
    ];

    return (
        <MainIndexJB
            pageKey='jb_candidates'
            extraBread={ExtraBread}
            newFilters={newFilters}
        >
            <SearchAssign
                keepKeys={keepKeys}
                newFilters={newFilters}
                infoCandidate={infoCandidate}
                allEvaluations={allEvaluations}
            />
            <TableAssign
                loading={loading}
                evaluations={evaluations}
                infoCandidate={infoCandidate}
                getEvaluations={getEvaluations}
                fetching={loading}
            />
        </MainIndexJB>
    )
}

// export default assign;

export default withAuthSync(assign)