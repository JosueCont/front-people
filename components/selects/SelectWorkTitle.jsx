import { connect } from "react-redux";
import { Form, Select } from "antd";
import { useEffect, useState } from "react";

const SelectWorkTitle = ({
  viewLabel = true,
  disabled = false,
  rules = [],
  labelText = "Plaza laboral",
  department = null,
  job = null,
  name = "cat_work_title",
  ...props
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions([]);
    if (props.cat_work_title) {
      let data = props.cat_work_title.filter((item) => item.person === null);

      if (department && job) {
        data = data.filter(
          (item) => item.department.id === department && item.job.id === job
        );
      } else if (department) {
        data = data.filter((item) => item.department.id === department);
      } else if (job) {
        data = data.filter((item) => item.job.id === job);
      }

      data = data.map((item) => {
        return {
          label: item.name,
          value: item.id,
          key: item.id,
        };
      });

      setOptions(data);
    }
  }, [department, job]);

  return (
    <Form.Item
      key="itemPlace"
      name={name ? name : "cat_work_title"}
      label={viewLabel ? labelText : ""}
      rules={rules}
    >
      <Select
        disabled={disabled}
        key="SelectPlace"
        // options={options}
        placeholder="Plaza laboral"
        allowClear
        style={props.style ? props.style : {}}
        onChange={props.onChange ? props.onChange : null}
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
  );
};

const mapState = (state) => {
  return {
    cat_work_title: state.catalogStore.cat_work_title,
  };
};

export default connect(mapState)(SelectWorkTitle);
