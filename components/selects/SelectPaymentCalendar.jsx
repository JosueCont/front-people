import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Select } from "antd";

const SelectPaymentCalendar = ({
  disabled,
  viewLabel = true,
  rules = [],
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

  const setCalendarSelect = (value) => {
    props.setCalendarId(value);
  };

  return (
    <Form.Item name="calendar" label={viewLabel ? "Calendario de pago" : ""}>
      <Select
        onChange={(value) => setCalendarSelect(value)}
        options={calendar}
        placeholder="Calendario de pago"
        allowClear
      />
    </Form.Item>
  );
};

const mapState = (state) => {
  return {
    payment_alendar: state.payrollStore.payment_calendar,
  };
};

export default connect(mapState)(SelectPaymentCalendar);
