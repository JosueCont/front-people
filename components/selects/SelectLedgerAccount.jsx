import { Select, Form } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ruleRequired } from "../../utils/rules";
const { Option } = Select;

const SelectGroup = ({ viewLabel,placeholder='Cuentas contables', required = true, ...props }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (props.cat_groups) {
      setGroups(
        props.cat_groups.map((a) => {
          return { label: a.name, value: a.id };
        })
      );
    }
  }, [props.cat_groups]);

  return (
    <Form.Item
      rules={[required && ruleRequired]}
      name="groups"
      label={viewLabel ? "Cuentas contables" : ""}
    >
      <Select
        // options={groups}
        showArrow
        style={{ width: "100%" }}
        placeholder={placeholder}
        notFoundContent="No se encontraron resultados"
        showSearch
        optionFilterProp="children"
      >
        {groups.map((item) => {
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
    cat_groups: state.catalogStore.cat_groups,
  };
};

export default connect(mapState)(SelectGroup);
