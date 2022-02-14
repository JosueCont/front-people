import React from 'react'
import {Select} from 'antd';
import {intranetAccess} from '../../utils/constant'

const SelectAccessIntranet = () => {
    const { Option } = Select;
    return (
        <Select placeholder="Acceso     a la intranet" options={intranetAccess}>
        </Select>
    )
}

export default SelectAccessIntranet