import moment from 'moment';
import { deleteKeyByValue } from '../../../../utils/constant';

export const useProcessInfo = ({
    formVacancies,
    infoVacant,
    setListInterviewers,
    listInterviewers,
    listLangDomain,
    setListLangDomain
}) =>{

    const { setFieldsValue } = formVacancies;

    const haveProperties = (obj) => Object.keys(obj).length > 0;

    const getSubObj = () =>{
        let features = {...infoVacant};
        let education = {};
        let salary = {};
        let recruitment = {};

        if(infoVacant.education_and_competence){
            education = Object.assign(infoVacant.education_and_competence);
            delete features.education_and_competence;
        }
        if(infoVacant.salary_and_benefits){
            salary = Object.assign(infoVacant.salary_and_benefits);
            delete features.salary_and_benefits;
        }
        if(infoVacant.recruitment_process){
            recruitment = Object.assign(infoVacant.recruitment_process);
            delete features.recruitment_process;
        }
        if(infoVacant.customer){
            features.customer_id = infoVacant.customer?.id;
            delete features.customer;
        }
        return{ features, education, salary, recruitment };
    }

    const valuesFeatures = ({features}) =>{
        let details = {...features};
        if(details.age_range?.length > 0){
            details['age_min'] = details.age_range[0];
            details['age_max'] = details.age_range[1];
        }
        if(details.assignment_date) details['assignment_date'] = moment(details.assignment_date);
        if(details.customer) details['customer_id'] = details.customer.id;
        return details;
    }

    const valuesEducation = ({education}) =>{
        const have_info = haveProperties(education);
        if(!have_info) return {};
        let details = {...education};
        const {
            main_category,
            sub_category,
            academics_degree,
            competences,
            languages,
            experiences,
            technical_skills
        } = details;

        if(main_category && Object.keys(main_category).length > 0) details['main_category'] = main_category.id;
        if(sub_category && Object.keys(sub_category).length > 0) details['sub_category'] = sub_category.id;
        if(academics_degree?.length > 0) details['academics_degree'] = academics_degree.at(-1).id;
        if(competences?.length > 0) details['competences'] = competences.map(item=> item.id);
        if(languages?.length > 0) setListLangDomain(languages.map(item => ({lang: item.lang, domain: item.domain})));
        if(experiences?.length > 0) details['experiences'] = experiences.join(',\n');
        if(technical_skills?.length > 0) details['technical_skills'] = technical_skills.join(',\n');
        
        delete details.id;
        return details;
    }

    const valuesSalary = ({salary}) =>{
        const have_info = haveProperties(salary);
        if(!have_info) return {};
        delete salary.id;
        return salary;
    }

    const valuesRecruitment = ({recruitment}) => {
        const have_info = haveProperties(recruitment);
        if(!have_info) return {};
        const { interviewers } = recruitment;
        if(interviewers?.length > 0) setListInterviewers(interviewers);
        delete recruitment.id;
        return recruitment;
    }

    const setValuesForm = async () =>{
        let vacant = getSubObj();
        let info_features = valuesFeatures(vacant);
        let info_education = valuesEducation(vacant);
        let info_salary = valuesSalary(vacant);
        let info_recruitment = valuesRecruitment(vacant);
        let all_info = deleteKeyByValue({
            ...info_features,
            ...info_education,
            ...info_salary,
            ...info_recruitment
        });
        setFieldsValue(all_info);
    }

    const createData = (obj) =>{
        let info = deleteKeyByValue(obj);
        if(info.assignment_date){
            let formatDate = info.assignment_date.format('YYYY-MM-DD');
            info.assignment_date = formatDate;
        }
        if(info.age_min && info.age_max) info.age_range = [info.age_min, info.age_max];
        if(info.academics_degree) info.academics_degree = [info.academics_degree];
        if(info.experiences) info.experiences = info.experiences.split(',');
        if(info.technical_skills) info.technical_skills = info.technical_skills.split(',');
        if(listInterviewers.length > 0) info.interviewers = listInterviewers;
        if(listLangDomain.length > 0) info.languages = listLangDomain;
        if(info.gross_salary){
            let salary_ = parseFloat(info.gross_salary.replaceAll(',',''));
            info.gross_salary = salary_.toLocaleString("es-MX", {maximumFractionDigits: 4});
        }
        return info;
    }

    return{
        setValuesForm,
        createData
    }
}