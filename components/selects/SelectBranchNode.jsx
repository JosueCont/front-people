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
    if (props.cat_branches || patronal_id) getBranchNode();
  }, [patronal_id, props.cat_branches]);

  const getBranchNode = () => {
    setOptions([]);
    if (patronal_id) {
      WebApiPeople.getBranches(`?patronal_registration=${patronal_id}`)
        .then((response) => {
          let branches = response.data.results.map((item) => {
            return {
              value: item.id,
              key: item.id + item.code,
              label: item.name,
            };
          });
          setOptions(branches);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      let branches = props.cat_branches.map((item) => {
        return { value: item.id, key: item.id + item.code, label: item.name };
      });
      setOptions(branches);
    }
  };

  return (
    <Form.Item name="branch_node" key="itemBranch" label="Sucursal">
      <Select
        key={"branhces"}
        showArrow
        mode={multiple && "multiple"}
        style={{ width: "100%" }}
        placeholder="Sucursal"
        notFoundContent="No se encontraron resultados"
        showSearch
        optionFilterProp="children"
      >
        {options &&
          options.map((item) => {
            return (
              <Option key={item.id} value={item.id}>
                {item.label}
              </Option>
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
