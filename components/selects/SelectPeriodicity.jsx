import { Select, Form } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
const { Option } = Select;
const SelectPeriodicity = ({
  viewLabel = true,
  rules = [],
  companyId,
  disabled = false,
  onChangePeriodicy,
  ...props
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (props.periodicity) {
      let data = props.periodicity.map((item) => {
        return {
          value: item.id,
          label: item.description,
          key: item.description + item.id,
        };
      });
      setOptions(data);
    }
  }, [props.periodicity]);

  console.log('Options', options)

  return (
    <>
      <Form.Item
        key="ItemPeriodicity"
        name={props.name ? props.name : "periodicity"}
        label={viewLabel ? "Periodicidad" : ""}
        rules={rules}
      >
        <Select
          size={props.size ? props.size : "middle"}
          key="SelectPeriodicity"
          // options={options}
          placeholder="Periodicidad"
          allowClear
          style={props.style ? props.style : {}}
          notFoundContent={"No se encontraron resultados."}
          showSearch
          optionFilterProp="children"
          disabled={disabled}
          onChange = { (e) => onChangePeriodicy(e) }
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
    periodicity: state.fiscalStore.payment_periodicity,
  };
};

export default connect(mapState)(SelectPeriodicity);
