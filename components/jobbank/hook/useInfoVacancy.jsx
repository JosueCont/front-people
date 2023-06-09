import moment from 'moment';

export const useInfoVacancy = () =>{

    const checkValues = (values) => {
        return Object.entries(values).reduce((obj, [key, val]) => {
            if(Array.isArray(val) && val.length <=0) return {...obj, [key]: undefined};
            return {...obj, [key]: val ?? null};
        }, {});
    };

    const haveProperties = (obj) => Object.keys(obj).length > 0;

    const getSubObj = (values) =>{
        let features = {...values};
        let education = {};
        let salary = {};
        let recruitment = {};

        if(values.education_and_competence){
            education = Object.assign(values.education_and_competence);
            delete features.education_and_competence;
        }
        if(values.salary_and_benefits){
            salary = Object.assign(values.salary_and_benefits);
            delete features.salary_and_benefits;
        }
        if(values.recruitment_process){
            recruitment = Object.assign(values.recruitment_process);
            delete features.recruitment_process;
        }
        if(values.customer){
            features.customer_id = values.customer?.id;
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
        details.location_id = details.location;
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
            technical_skills
        } = details;

        if(main_category && Object.keys(main_category).length > 0) details['main_category'] = main_category.id;
        if(sub_category && Object.keys(sub_category).length > 0) details['sub_category'] = sub_category.id;
        if(academics_degree?.length > 0) details['academics_degree'] = academics_degree.at(-1).id;
        if(competences?.length > 0) details['competences'] = competences.map(item=> item.id);
        if(technical_skills?.length > 0) details['technical_skills'] = technical_skills.join(',\n');

        const getLang = item => `${item.lang}-${item.domain}`;
        details['languages'] = languages?.length > 0 ? languages.map(getLang) : [];
        
        delete details.id;
        return details;
    }

    const valuesSalary = ({salary}) =>{
        const have_info = haveProperties(salary);
        if(!have_info) return {};
        if(salary.gross_salary){
            let salary_ = parseFloat(salary.gross_salary.replaceAll(',',''));
            salary.gross_salary = salary_.toLocaleString("es-MX", {maximumFractionDigits: 4});
        }
        delete salary.id;
        return salary;
    }

    const valuesRecruitment = ({recruitment}) => {
        const have_info = haveProperties(recruitment);
        if(!have_info) return {};
        delete recruitment.id;
        return recruitment;
    }

    const setValuesForm = (values) =>{
        let vacant = getSubObj(values);
        let info_features = valuesFeatures(vacant);
        let info_education = valuesEducation(vacant);
        let info_salary = valuesSalary(vacant);
        let info_recruitment = valuesRecruitment(vacant);
        return checkValues({
            ...info_features,
            ...info_education,
            ...info_salary,
            ...info_recruitment
        });
    }

    const createData = (values) =>{
        let info = checkValues(values);
        if(info.assignment_date){
            let formatDate = info.assignment_date.format('YYYY-MM-DD');
            info.assignment_date = formatDate;
        }
        if(info.age_min && info.age_max) info.age_range = [info.age_min, info.age_max];
        else info.age_range = [];
        if(info.academics_degree) info.academics_degree = [info.academics_degree];
        else info.academics_degree = [];
        // if(info.experiences) info.experiences = info.experiences.split(',');
        // else info.experiences = [];
        if(info.technical_skills) info.technical_skills = info.technical_skills.split(',');
        else info.technical_skills = [];
        if(info.gross_salary) info.gross_salary = info.gross_salary.replaceAll(',','');

        const getLang_ = item =>{
            let value = item.split('-');
            return {lang: value[0], domain: value[1]};
        };
        let formatLang = info.languages?.map(getLang_);
        info.languages = info.languages?.length > 0 ? formatLang : [];

        return info;
    }

    return{
        setValuesForm,
        createData
    }
}