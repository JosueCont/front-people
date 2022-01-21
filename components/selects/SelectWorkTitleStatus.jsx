import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Select } from "antd";


const SelectWorkTitleStatus = ({titleLabel = true, disabled = false, rules = [], companyId, ...props}) => {
    const options = [
        {
          value: 2,
          label: 'Estatus 1',
          key: 'status1',
        },
        {
          value: 3,
          label: 'Estatus 2',
          key: 'status2',
        }
    ]

    return (
        <Form.Item
            key="itemWorkTitleStatus"
            name={"work_title_status"}
            label={titleLabel ? "Estatus de plaza laboral" : ""}

            rules={rules}
        >
            <Select
                disabled={disabled}
                key="SelectWorkTitleStatus"
                options={options}
                placeholder="Estatus de Plaza laboral"
                allowClear
                style={props.style ? props.style : {}}
                onChange={props.onChange ? props.onChange : null}
                notFoundContent={"No se encontraron resultados."}
            />
        </Form.Item>
    )
}

export default SelectWorkTitleStatus
