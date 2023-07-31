import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Select } from "antd";
import {getPaymentCalendar} from "../../redux/payrollDuck";
const { Option } = Select;
const SelectPaymentCalendar = ({
  disabled,
  viewLabel = true,
  rules = [],
  getPaymentCalendar,
  currentNode,
  ...props
}) => {
  const [calendar, setCalendar] = useState([]);

  useEffect(() => {
    setCalendar([]);
    if (props.payment_alendar) {
      let cats = props.payment_alendar.map((a) => {
        return { label: a.name, value: a.id };
      });
      setCalendar(cats);
    }
  }, [props.payment_alendar]);

  useEffect(()=>{
    getPaymentCalendar(currentNode?.id)
  },[])

  const setCalendarSelect = (value) => {
    props.setCalendarId(value);
  };

  return (
    <Form.Item name="calendar" label={viewLabel ? "Calendario de pago" : ""} rules={ rules && rules.length > 0? rules : [] }>
      <Select
        onChange={(value) => setCalendarSelect(value)}
        // options={calendar}
        placeholder="Calendario de pago"
        allowClear
        showSearch
        optionFilterProp="children"
      >
        {calendar.map((item,i) => {
          return (
            <>
              <Option key={item.value+i} value={item.value}>
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
    payment_alendar: state.payrollStore.payment_calendar,
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState,{getPaymentCalendar})(SelectPaymentCalendar);
