import { Card, Col, Row } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import FormCaledanrXml from "./formCalendarXml";
import { LeftCircleTwoTone, RightCircleTwoTone } from "@ant-design/icons";

const CalendarImport = ({
  company = null,
  paymentPeriodicity = null,
  patronalSelect = null,
  setPerson,
  ...props
}) => {
  const [validDatas, setValidDatas] = useState(false);
  const [periodicities, setPeriodicities] = useState();
  const [calendarSelect, setCalendarSelect] = useState(0);

  useEffect;

  useEffect(() => {
    console.log("Company", company);
    console.log("paymentPeriodicity", paymentPeriodicity);
    console.log("patronalSelect", patronalSelect);
    if (
      company != null &&
      paymentPeriodicity != null &&
      patronalSelect != null
    ) {
      setValidDatas(true);
      setCalendarSelect(0);
      // if (company && company.patronal_registrations) {
      //   company.patronal_registrations[patronalSelect].periodicities.map(
      //     (p) => {
      //       if (!p.calendar)
      //         p.calendar = {
      //           periodicity: p.periodicity,
      //           name: "",
      //           type_tax: "",
      //           perception_type: "",
      //           start_date: "",
      //           period: 2022,
      //           active: false,
      //           annual_adjustment: false,
      //           monthly_adjustment: false,
      //         };
      //     }
      //   );
      //   setPeriodicities(
      //     company.patronal_registrations[patronalSelect].periodicities
      //   );
      // } else if (company && company.periodicities) {
      //   company.periodicities.map((p, i) => {
      //     if (!p.calendar)
      //       p.calendar = {
      //         periodicity: p.periodicity,
      //         name: "",
      //         type_tax: "",
      //         perception_type: "",
      //         start_date: "",
      //         period: 2022,
      //         active: true,
      //         annual_adjustment: false,
      //         monthly_adjustment: false,
      //       };
      //   });
      // setPeriodicities(company.periodicities);
      // }
    }
  }, [company, patronalSelect, paymentPeriodicity]);

  const nextPrev = (value) => {
    if (value)
      calendarSelect < periodicities.length - 1 &&
        setCalendarSelect(calendarSelect + 1);
    else calendarSelect > 0 && setCalendarSelect(calendarSelect - 1);
  };

  useEffect(() => {
    console.log("Periodicities-->>", periodicities);
    if (calendarSelect != null && periodicities)
      setPerson(periodicities[calendarSelect].cfdis);
  }, [calendarSelect, periodicities]);

  return (
    validDatas &&
    periodicities && (
      <Col span={24}>
        <Card className={"form_header_import_"}>
          {periodicities.length > 0 && (
            <>
              <Row align="center" style={{ width: "100%", padding: "10px" }}>
                <span
                  style={{
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
                      fontSize: "25px",
                      fontWeight: "bold",
                      marginTop: "-2px",
                    }}
                  >
                    {periodicities &&
                      paymentPeriodicity.length > 0 &&
                      paymentPeriodicity.find(
                        (item) =>
                          item.id ==
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
                  {/* <FormCaledanrXml
                    calendar={periodicities[calendarSelect]}
                    paymentPeriodicity={paymentPeriodicity}
                  /> */}
                </Row>
              </Row>
            </>
          )}
        </Card>
      </Col>
    )
  );
};

export default CalendarImport;
