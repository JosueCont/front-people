import moment from 'moment';

export const useProcessInfo = ({
    formJobBank,
    info_vacant
}) =>{

    const { setFieldsValue } = formJobBank;

    const haveKeys = (obj) => Object.keys(obj).length > 0;

    const valuesFeatures = async () =>{
        let info_obj = {};
        if(info_vacant.age_range?.length > 0){
            info_obj['age_min'] = info_vacant.age_range[0];
            info_obj['age_max'] = info_vacant.age_range[1];
        }
        if(info_vacant.assignment_date){
            info_obj['assignment_date'] = moment(info_vacant.assignment_date);
        }
        return info_obj;
    }

    const valuesEducation = async () =>{
        const have_info = haveKeys(info_vacant.education_and_competence);
        if(!have_info) return {};

        const { education_and_competence } = info_vacant;
        let info_obj = {...education_and_competence};
        const {
            main_category,
            sub_category,
            academics_degree,
            competences,
            languajes,
            experiences,
            technical_skills
        } = education_and_competence;

        if(main_category && Object.keys(main_category).length > 0) info_obj['main_category'] = main_category.id;
        if(sub_category && Object.keys(sub_category).length > 0) info_obj['sub_category'] = sub_category.id;
        if(academics_degree?.length > 0) info_obj['academics_degree'] = academics_degree.at(-1).id;
        if(competences?.length > 0) info_obj['competences'] = competences.map(item=> item.id);
        if(languajes?.length > 0) info_obj['languajes'] = languajes.map(item => item.lang);
        if(experiences?.length > 0) info_obj['experiences'] = experiences.join(',\n');
        if(experiences?.length <= 0) info_obj['experiences'] = null;
        if(technical_skills?.length > 0) info_obj['technical_skills'] = technical_skills.join(',\n');
        if(technical_skills?.length <= 0) info_obj['technical_skills'] = null;

        return info_obj;
    }

    const valuesSalary = async () =>{
        const have_info = haveKeys(info_vacant.salary_and_benefits_set);
        if(!have_info) return {};
        return info_vacant.salary_and_benefits_set
    }

    const valuesRecruitment = () =>{
        const have_info = haveKeys(info_vacant.recruitment_process);
        if(!have_info) return {};
        return info_vacant.recruitment_process
    }

    const setValuesForm = async () =>{
        let info_features = await valuesFeatures();
        let info_education = await valuesEducation();
        let info_salary = await valuesSalary();
        let info_recruitment = await valuesRecruitment();
        
        setFieldsValue({
            ...info_vacant,
            ...info_features,
            ...info_education,
            ...info_salary,
            ...info_recruitment
        });
    }

    const createData = async (obj) =>{
        let info = Object.assign(obj);
        if(info.assignment_date){
            let formatDate = info.assignment_date.format('YYYY-MM-DD');
            info.assignment_date = formatDate;
        }
        if(info.languajes?.length > 0){
            info.languajes = info.languajes.map(item => {
                return { lang: item, domain: 1 };
            })
        }
        console.log('info experiences------->', info.experiences)
        if(info.age_min && info.age_max) info.age_range = [info.age_min, info.age_max];
        if(info.academics_degree) info.academics_degree = [info.academics_degree];
        if(info.experiences) info.experiences = info.experiences.split(',');
        if(info.technical_skills) info.technical_skills = info.technical_skills.split(',');
        if(info.interviewers?.length <= 0) info.interviewers = undefined;

        return info;
    }

    return{
        setValuesForm,
        createData
    }
}