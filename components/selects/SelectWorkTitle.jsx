import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Select } from "antd";

const SelectWorkTitle = ({titleLabel = true, disabled = false, rules = [], companyId, ...props}) => {

    const options = [
        {
          value: 1,
          label: 'Plaza 1',
          key: 'plaza_1',
        },
        {
          value: 2,
          label: 'Plaza 2',
          key: 'plaza_2',
        },
        {
          value: 3,
          label: 'Plaza 3',
          key: 'plaza_3',
        }
    ]

    return (
        <Form.Item
            key="itemPlace"
            name={"work_title"}
            label={titleLabel ? "Plaza laboral" : ""}

            rules={rules}
        >
            <Select
                disabled={disabled}
                key="SelectPlace"
                options={options}
                placeholder="Plaza laboral"
                allowClear
                style={props.style ? props.style : {}}
                onChange={props.onChange ? props.onChange : null}
                notFoundContent={"No se encontraron resultados."}
            />
        </Form.Item>
    )
}

export default SelectWorkTitle
