import React from 'react'
import {Select} from 'antd';
import {intranetAccess} from '../../utils/constant'

const SelectAccessIntranet = ({value="", onChange=null, ...props}) => {
    const { Option } = Select;
    return (
        <Select
            value={value?value: null} 
            placeholder="Acceso a la intranet" 
            options={intranetAccess}
            onChange={onChange}
            allowClear
        />
    )
}

export default SelectAccessIntranet