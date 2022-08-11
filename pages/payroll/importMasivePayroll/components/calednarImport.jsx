import { Card, Col, Row } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import FormCaledanrXml from "./formCalendarXml";
import { LeftCircleTwoTone, RightCircleTwoTone } from "@ant-design/icons";

const CalendarImport = ({
  company,
  paymentPeriodicity,
  patronalSelect,
  ...props
}) => {
  const [periodicities, setPeriodicities] = useState([]);
  const [calendarSelect, setCalendarSelect] = useState(0);

  useEffect(() => {
    setCalendarSelect(0);
    if (company && company.patronal_registrations) {
      company.patronal_registrations[patronalSelect].periodicities.map((p) => {
        if (!p.calendar)
          p.calendar = {
            periodicity: p.periodicity_code,
            name: "",
            type_tax: "",
            perception_type: "",
            start_date: "",
            period: 2022,
            active: false,
            annual_adjustment: false,
            monthly_adjustment: false,
          };
      });
      setPeriodicities(
        company.patronal_registrations[patronalSelect].periodicities
      );
    } else if (company && company.periodicities) {
      company.periodicities.map((p) => {
        if (!p.calendar)
          p.calendar = {
            periodicity: p.periodicity_code,
            name: "",
            type_tax: "",
            perception_type: "",
            start_date: "",
            period: 2022,
            active: true,
            annual_adjustment: false,
            monthly_adjustment: false,
          };
      });
      setPeriodicities(company.periodicities);
    }
    console.log(periodicities);
  }, [company, patronalSelect]);

  const nextPrev = (value) => {
    if (value)
      calendarSelect < periodicities.length - 1 &&
        setCalendarSelect(calendarSelect + 1);
    else calendarSelect > 0 && setCalendarSelect(calendarSelect - 1);
  };

  return (
    <Col span={24}>
      <Card className="form_header">
        {periodicities.length > 0 && (
          <>
            <Row align="center" style={{ width: "100%", padding: "10px" }}>
              <span
                style={{
                  color: "white",
                  fontSize: "25px",
                  fontWeight: "bold",
                  marginRight: "10px",
                }}
              >
                Calendario
              </span>
              {periodicities.length > 1 && (
                <Col align="center" span={1}>
                  <LeftCircleTwoTone
                    onClick={() => nextPrev(false)}
                    style={{ fontSize: "32px" }}
                  />
                </Col>
              )}
              <Col>
                <span
                  style={{
                    color: "white",
                    fontSize: "25px",
                    fontWeight: "bold",
                    marginTop: "-2px",
                  }}
                >
                  {paymentPeriodicity.length > 0 &&
                    paymentPeriodicity.find(
                      (item) =>
                        item.code ==
                        periodicities[calendarSelect].calendar.periodicity
                    ).description}
                </span>
              </Col>
              {periodicities.length > 1 && (
                <Col align="center" span={1}>
                  <RightCircleTwoTone
                    onClick={() => nextPrev(true)}
                    style={{ fontSize: "32px" }}
                  />
                </Col>
              )}
            </Row>
            <Row justify="space-between">
              <Row style={{ width: "100%" }}>
                <FormCaledanrXml
                  calendar={periodicities[calendarSelect]}
                  paymentPeriodicity={paymentPeriodicity}
                />
              </Row>
            </Row>
          </>
        )}
      </Card>
    </Col>
  );
};

export default CalendarImport;
