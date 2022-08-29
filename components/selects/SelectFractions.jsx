import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { connect } from "react-redux";
const { Option } = Select;
const SelectFractions = ({
                       disabled,
                       viewLabel = true,
                       rules = [],
                       size = "middle",
                       ...props
                   }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        setOptions([]);
        if (props.cat_fractions) {
            let data = props.cat_fractions.map((item, index) => {
                return {
                    label:`${item.code} - ${item.description}`,
                    value: item.id,
                    key: item.id + index
                };
            });
            setOptions(data);
        }
    }, [props.cat_fractions]);

    return (
        <>
            <Form.Item
                key={"rt_fraction"}
                name={props.name ? props.name : "job"}
                label={viewLabel ? "Fracción RT" : ""}
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
                >
                    {options.map((item) => {
                        return (
                            <>
                                <Option key={item.value} value={item.value}>
                                    {item.label}
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
        cat_fractions: state.catalogStore.cat_fractions,
    };
};

export default connect(mapState)(SelectFractions);
