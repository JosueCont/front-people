import { Select, Form } from "antd";
import { connect } from "react-redux";
const { Option } = Select;

const SelectCostCenter = ({ multiple=false,name='cost_center', viewLabel='',placeholder='Centro de costos', required = true,cat_cost_center, ...props }) => {

  return (
    <Form.Item
      name={name}
      key="itemCostCenter"
      label={viewLabel}
    >
      <Select
        showArrow
        mode={multiple && 'multiple'}
        style={{ width: "100%" }}
        placeholder={placeholder}
        notFoundContent="No se encontraron resultados"
        showSearch
        optionFilterProp="children"
        allowClear={props.allowClear ? true : false}
      >
        {cat_cost_center && cat_cost_center.map((item) => {
          return (
              <Option key={item.id} value={item.id}>
                {item.code}
              </Option>
          )
        })}
      </Select>
    </Form.Item>
  );
};

const mapState = (state) => {
  return {
    cat_cost_center: state.catalogStore.cat_cost_center,
  };
};

export default connect(mapState)(SelectCostCenter);
