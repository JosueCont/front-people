import { Select, Form } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
const { Option } = Select;
const SelectPeriodicity = ({
  viewLabel = true,
  rules = [],
  companyId,
  disabled = false,
  onChangePeriodicy = null,
  ...props
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (props.periodicity) {
      let data = props.periodicity.filter((item) => {
        if(item.code === '02' ||
            item.code === '03' ||
            item.code === '04' ||
            item.code==='05' ){
          return {
            value: item.id,
            label: item.description,
            key: item.description + item.id,
          };
        }
      });

      data = data.map((item) => {
          return {
            value: item.id,
            label: item.description,
            key: item.description + item.id,
          };
      });
      setOptions(data);
    }
  }, [props.periodicity]);

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
          onChange={(e) => onChangePeriodicy && onChangePeriodicy(e)}
        >
          {options.map((item) => {
            if(item?.value){
              return (
                  <>
                    <Option key={item?.key} value={item?.value}>
                      {item?.label}
                    </Option>
                    ;
                  </>
              );
            }

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
