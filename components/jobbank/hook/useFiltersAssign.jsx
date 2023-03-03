import { optionsStatusApply } from "../../../utils/constant"
import { getValueFilter } from "../../../utils/functions"

export const useFitersAssign = () =>{

    const listKeys = {
        name_assessment: 'Nombre',
        status_apply: 'Estatus',
        date_finish: 'Fecha fin'
    }

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusApply,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const listGets = {
        status_apply: getStatus
    }

    return { listKeys, listGets }

}