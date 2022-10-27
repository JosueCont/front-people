import moment from 'moment';
import { deleteKeyByValue } from '../../../../utils/constant';

export const useProcessInfo = ({
    info_strategy,
    formStrategies
}) => {

    const { setFieldsValue } = formStrategies;

    const setValuesForm = () =>{
        let info = deleteKeyByValue(info_strategy);
        if(info.assignment_date){
            info.assignment_date = moment(info.assignment_date);
        }
        if(info.candidates_date_send){
            info.candidates_date_send = moment(info.candidates_date_send);
        }
        if(info.candidate_acceptance_date){
            info.candidate_acceptance_date = moment(info.candidate_acceptance_date);
        }
        if(info.hiring_rejection_date){
            info.hiring_rejection_date = moment(info.hiring_rejection_date);
        }
        setFieldsValue(info)
    }

    const createData = (obj) =>{
        let info = deleteKeyByValue(obj);

        if(info.assignment_date){
            info.assignment_date = info.assignment_date.format('YYYY-MM-DD');
        }
        if(info.candidates_date_send){
            info.candidates_date_send = info.candidates_date_send.format('YYYY-MM-DD');
        }
        if(info.candidate_acceptance_date){
            info.candidate_acceptance_date = info.candidate_acceptance_date.format('YYYY-MM-DD');
        }
        if(info.hiring_rejection_date){
            info.hiring_rejection_date = info.hiring_rejection_date.format('YYYY-MM-DD');
        }

        return info;
    }

    return {
        setValuesForm,
        createData
    }
}