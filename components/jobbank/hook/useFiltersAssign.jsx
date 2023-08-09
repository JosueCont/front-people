import { optionsStatusApply } from "../../../utils/constant"
import { getValueFilter } from "../../../utils/functions"

export const useFitersAssign = () =>{

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusApply,
        keyEquals: 'value',
        keyShow: 'label'
    })
    
    const listKeys = {
        name_assessment: {
            name: 'Nombre'
        },
        status_apply: {
            name: 'Estatus',
            get: getStatus
        },
        date_finish: {
            name: 'Fecha fin'
        }
    }

    return { listKeys }

}