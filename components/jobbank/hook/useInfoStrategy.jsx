import moment from 'moment';

export const useInfoStrategy = () => {

    const format = 'YYYY-MM-DD';

    const checkValues = (values) => {
        return Object.entries(values).reduce((obj, [key, val]) => {
            if(Array.isArray(val) && val.length <=0) return {...obj, [key]: undefined};
            return {...obj, [key] : val ?? null};
        }, {});
    };

    const setValuesForm = (values) =>{
        let info = checkValues(values);
        info.recruiter = info.recruiter?.id ? info.recruiter?.id : null;
        info.business_executive = info?.business_executive?.id ? info?.business_executive?.id : null;
        if(info.customer?.id) info.customer = info.customer?.id;
        if(info.assignment_date) info.assignment_date = moment(info.assignment_date, format);
        if(info.candidates_date_send) info.candidates_date_send = moment(info.candidates_date_send, format);
        if(info.candidate_acceptance_date) info.candidate_acceptance_date = moment(info.candidate_acceptance_date, format);
        if(info.hiring_rejection_date) info.hiring_rejection_date = moment(info.hiring_rejection_date, format);
        if(info.job_vacancies?.length > 0) info.job_vacancies = info.job_vacancies.map(item => item.id);
        return info;
    }

    const createData = (obj) =>{
        let info = checkValues(obj);
        if(!info.job_vacancies) info.job_vacancies = [];
        if(info.assignment_date) info.assignment_date = info.assignment_date.format('YYYY-MM-DD');
        if(info.candidates_date_send) info.candidates_date_send = info.candidates_date_send.format('YYYY-MM-DD');
        if(info.candidate_acceptance_date) info.candidate_acceptance_date = info.candidate_acceptance_date.format('YYYY-MM-DD');
        if(info.hiring_rejection_date) info.hiring_rejection_date = info.hiring_rejection_date.format('YYYY-MM-DD');
        return info;
    }

    return {
        setValuesForm,
        createData
    }
}