import { Select, Form } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const SelectPeriodicity = ({
  viewLabel = true,
  rules = [],
  companyId,
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

  return (
    <>
      <Form.Item
        key="ItemPeriodicity"
        name={props.name ? props.name : "periodicity"}
        label={viewLabel ? "Periocidad" : ""}
        rules={rules}
      >
        <Select
          size={props.size ? props.size : "middle"}
          key="SelectPeriodicity"
          options={options}
          placeholder="Periocidad"
          allowClear
          style={props.style ? props.style : {}}
          notFoundContent={"No se encontraron resultados."}
        />
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
