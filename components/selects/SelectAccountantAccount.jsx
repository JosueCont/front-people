import { Select, Form } from "antd";
import { connect } from "react-redux";
const { Option } = Select;

const SelectAccountantAccount = ({ multiple=false,name='accountant_account',
                                   viewLabel='Cuenta contable',placeholder='',
                                   required = true,cat_accounts, ...props }) => {

  return (
    <Form.Item
      name={name}
      key="itemaccounts"
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
        {cat_accounts && cat_accounts.map((item) => {
          return (
              <Option key={item.id} value={item.id}>
                {item.account} - {item.description}
              </Option>
          )
        })}
      </Select>
    </Form.Item>
  );
};

const mapState = (state) => {
  return {
    cat_accounts: state.catalogStore.cat_accounts,
  };
};

export default connect(mapState)(SelectAccountantAccount);
