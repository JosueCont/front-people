import React from 'react'
import {Select} from 'antd';
import {intranetAccess} from '../../utils/constant'

const SelectAccessIntranet = ({value=null, onChange=null, ...props}) => {
    const { Option } = Select;
    return (
        <Select
            value={value} 
            placeholder="Acceso a la intranet" 
            options={intranetAccess}
            onChange={onChange}
        />
    )
}

export default SelectAccessIntranet