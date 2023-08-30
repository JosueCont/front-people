import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Select } from "antd";

const SelectFixedConcept = ({
  disabled = false,
  viewLabel = true,
  rules = [],
  type = 1,
  placeholder = false,
  multiple=true,
  ...props
}) => {
  const [concept, setConcept] = useState([]);

  useEffect(() => {
    setConcept([]);
    let cats = [];
    if (props.fixed_concept && type == 1) {
      cats = props.fixed_concept.map((a) => {
        return { label: a.name, value: a.id };
      });
    } else if (props.group_fixed_concept && type == 2) {
      cats = props.group_fixed_concept.map((a) => {
        return { label: a.name, value: a.id };
      });
    }
    setConcept(cats);
  }, [props.fixed_concept, props.group_fixed_concept]);

  return (
    <Form.Item
      name={type === 1 ? "fixed_concept" : "group_fixed_concept"}
      label={
        viewLabel
          ? type === 1
            ? "Conceptos fijos"
            : "Grupo de conceptos fijos"
          : ""
      }
      help={type === 1 && multiple && <small>Elige uno o varios</small>}
    >
      <Select
        // options={concept}
        mode={type === 1 && multiple && "multiple"}
        placeholder={placeholder && "Conceptos fijos"}
        showSearch
        optionFilterProp="children"
        disabled={disabled}
        allowClear
      >
        {concept.map((item) => {
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
  );
};

const mapState = (state) => {
  return {
    group_fixed_concept: state.payrollStore.group_fixed_concept,
    fixed_concept: state.payrollStore.fixed_concept,
  };
};

export default connect(mapState)(SelectFixedConcept);
