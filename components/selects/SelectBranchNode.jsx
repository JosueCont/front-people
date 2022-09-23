import { Select, Form } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import WebApiPeople from "../../api/WebApiPeople";
const { Option } = Select;

const SelectBranchNode = ({
  multiple = false,
  name = "branch_node",
  required = false,
  patronal_id = null,
  ...props
}) => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (props.cat_branches)
      setOptions(
        props.cat_branches.map((item) => {
          return { value: item.id, key: item.id, label: item.name };
        })
      );
  }, [props.cat_branches]);

  return (
    <Form.Item
      name="branch_node"
      key="itemBranch"
      label="Sucursal"
      rules={props.rules ? props.rules : null}
    >
      <Select
        key={"branches"}
        showArrow
        allowClear
        mode={multiple && "multiple"}
        style={{ width: "100%" }}
        placeholder="Sucursal"
        notFoundContent="No se encontraron resultados"
        showSearch
        optionFilterProp="children"
        onChange={props.onChange ? props.onChange : null}
      >
        {options &&
          options.map((item) => {
            return (
              <>
                <Option key={item.id} value={item.value}>
                  {item.label}
                </Option>
              </>
            );
          })}
      </Select>
    </Form.Item>
  );
};

const mapState = (state) => {
  return {
    cat_branches: state.catalogStore.cat_branches,
  };
};

export default connect(mapState)(SelectBranchNode);
