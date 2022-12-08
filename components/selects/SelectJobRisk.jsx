import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { connect } from "react-redux";
const { Option } = Select;
const SelectJobRisk = ({
                       disabled,
                       viewLabel = true,
                       rules = [],
                       size = "middle",
                       ...props
                   }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        setOptions([]);
        if (props.cat_job_risk) {
            let data = props.cat_job_risk.map((item, index) => {
                return {
                    label: item.code,
                    value: item.id,
                    key: item.id + index,
                    percent: item?.percent,
                    description: item.description
                };
            });
            setOptions(data);
        }
    }, [props.cat_job_risk]);

    return (
        <>
            <Form.Item
                key={"job_risk_class"}
                name={props.name ? props.name : "job"}
                label={viewLabel ? "Clase de riesgo de trabajo" : ""}
                rules={rules}
            >
                <Select
                    disabled={disabled}
                    key="SelectJob"
                    // options={options}
                    size={size}
                    placeholder="Clase de riesgo"
                    allowClear
                    notFoundContent={"No se encontraron resultados."}
                    showSearch
                    optionFilterProp="children"
                    {...props}
                >
                    {options.map((item) => {
                        return (
                            <>
                                <Option key={item.value} value={item.value}>
                                    {item.description} {`(${item.percent}%)`}
                                </Option>
                                ;
                            </>
                        );
                    })}
                </Select>
            </Form.Item>
        </>
    );
};

const mapState = (state) => {
    return {
        cat_job_risk: state.catalogStore.cat_job_risk,
    };
};

export default connect(mapState)(SelectJobRisk);
