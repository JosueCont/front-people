import WebApiAssessment from "../../../api/WebApiAssessment";
import { message } from "antd";
import { getCurrentURL, popupWindow } from "../../../utils/constant";
import moment from "moment";
import jwtEncode from "jwt-encode";
import { urlKuizBaseFront, typeHttp } from "../../../config/config";

let tenant = "demo";
if (process.browser) {
  let splitDomain = window.location.hostname.split(".");
  if (splitDomain.length > 0 && !splitDomain[0].includes('localhost') ) {
    tenant = splitDomain[0];
  }
}
// Set url Kuiz Base Front with Tenant
const urlKuizBaseFrontWithTenant = `${typeHttp}://${tenant}.${urlKuizBaseFront}`;

export const useViewResults = ({
    loadResults = {},
    setLoadResults,
    infoPerson = {}
}) =>{

    const formatDate = 'DD/MM/YYYY';
    const formatTime = 'hh:mm a';
    const basic = [
        '7_KHOR_EST_SOC',
        '4_KHOR_PERF_MOT',
        '16_KHOR_INT_EMO',
        '48_KHOR_INV_VAL_ORG',
        '5_KHOR_DOM_CER'
    ];

    const validateGetResults = (item) =>{
        setLoadResults({...loadResults, [item.code]: true});
        if(basic.includes(item.code)) getResultsBasic(item);
        else generateToken(item);
    }

    const getFieldResults = (code, data) =>{
        if(code == '7_KHOR_EST_SOC') return data.resultados ?? '';
        if(code == '4_KHOR_PERF_MOT') return data.summary_results ?? '';
        if(code == '48_KHOR_INV_VAL_ORG') return data.resultado ?? '';
        if(code == '16_KHOR_INT_EMO'){
            return data.results_string
                ? data.results_string?.split('.')[0]
                : '';
        }
        // if(code == '5_KHOR_DOM_CER')
        return data.dominant_factor && data.factors ? {
            interpretation: data.dominant_factor,
            results: {factors: data.factors}
        } : '';
    }

    const convertResults = (item) =>{
        let apply = item.applys[0];
        if(!apply) return '';
        if(typeof(apply.results) == 'string'){
            let strResults = apply.results.replace(/'/g, '"');
            let objResults = JSON.parse(strResults);
            return objResults.assessment_results ?? '';
        }
        return apply.variable_results ?? '';
    }

    const getInfoUser = () =>{
        let flast_name = infoPerson.flast_name ?? '';
        let mlast_name = infoPerson.mlast_name ?? '';
        return {
            user_id: infoPerson.id,
            firstname: infoPerson.first_name,
            lastname: `${flast_name} ${mlast_name}`,
            user_photo_url: infoPerson.photo_thumbnail ?? infoPerson.photo,
            company_id: infoPerson.node,
        }
    }

    const getObjToken = (apply) =>{
        let end_date = apply.end_date ? apply.end_date : apply.apply_date;
        return{
            url: getCurrentURL(),
            assessment_xtras: { stage: 2 },
            profile_results: null,
            apply_id: apply.id,
            assessment_date: {
                date: moment(end_date).format(formatDate),
                time: moment(end_date).format(formatTime)
            }
        }
    }

    const getResultsBasic = async (item) =>{
        try {
            let apply_id = item.applys[0]?.id;
            let response = await WebApiAssessment.getAssessmentResults({apply_id});
            generateToken(item, response.data);
        } catch (e) {
            console.log(e)
            message.error('Resultados no encontrados')
            setLoadResults({...loadResults, [item.code]: false});
        }
    }

    const generateToken = (item, data) =>{
        let assessment_results = data
            ? getFieldResults(item.code, data)
            : convertResults(item);
        if(!assessment_results){
            message.error('Resultados no encontrados')
            setLoadResults({...loadResults, [item.code]: false});
            return;
        }
        let infoUser = getInfoUser();
        let objToken = getObjToken(item.applys[0]);
        let bodyToken = {assessment: item.id, assessment_results};
        let setToken = {...objToken, ...bodyToken, ...infoUser};
        let jwtToken = jwtEncode(setToken, 'secret', 'HS256');
        const urlResults = `${urlKuizBaseFrontWithTenant}/?token=${jwtToken}`;
        setLoadResults({...loadResults, [item.code]: false});
        popupWindow(urlResults)
    }

    return { validateGetResults }

}