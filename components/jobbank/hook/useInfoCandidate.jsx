import { useSelector } from "react-redux";
import moment from "moment";

export const useInfoCandidate = ({
    fileCV,
    isAutoRegister
}) =>{

    const getNode = state => state.userStore.current_node;
    const currentNode = useSelector(getNode);
    const noValid = [undefined, null, '', ' '];

    const createData = (obj) =>{
        let dataCandidate = new FormData();
        dataCandidate.append('node', currentNode.id);
        dataCandidate.append('auto_register', isAutoRegister);
        if(fileCV.length > 0) dataCandidate.append('cv', fileCV[0]);
        
        const getLang_ = item =>{
            let value = item.split('-');
            return {lang: value[0], domain: value[1]};
        };

        Object.entries(obj).map(([key, val]) => {
            if(key == "languages"){
                let languages = Array.isArray(val) ? val.map(getLang_) : [];
                dataCandidate.append('languages', JSON.stringify(languages));
                return;
            }
            if(key == "notification_source"){
                let codes = Array.isArray(val) ? val : [];
                dataCandidate.append('notification_source', JSON.stringify(codes));
                return;
            }
            let value = noValid.includes(val) ? "" : val;
            dataCandidate.append(key, value);
        });
        
        return dataCandidate;
    }

    const setValuesForm = (values) =>{
        let info = {...values};
        const getLang = item => `${item.lang}-${item.domain}`;
        info.languages = values.languages?.length > 0 ? values.languages.map(getLang) : [];
        info.cv_name_read = values.cv ? values.cv.split('/').at(-1) : '';
        info.state = values?.state?.id ?? null;
        info.birthdate = values.birthdate ? moment(values.birthdate) : null;
        info.notification_source = Array.isArray(values.notification_source)
            ? values.notification_source : [];
        return info;
    }


    return { setValuesForm, createData }
}