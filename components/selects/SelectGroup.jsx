import { Select, Form } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ruleRequired } from "../../utils/constant";

const SelectGroup = ({ titleLabel, ...props }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (props.cat_groups) {
      setGroups(props.cat_groups);
    }
  }, [props.cat_groups]);

  return (
    <Form.Item
      rules={[ruleRequired]}
      name="groups"
      label="Perfil de seguridad"
      label={titleLabel ? "Perfil de seguridad" : ""}
    >
      <Select
        options={groups}
        showArrow
        style={{ width: "100%" }}
        placeholder="Perfiles de seguridad"
      ></Select>
    </Form.Item>
  );
};

const mapState = (state) => {
  return {
    cat_groups: state.catalogStore.cat_groups,
  };
};

export default connect(mapState)(SelectGroup);
