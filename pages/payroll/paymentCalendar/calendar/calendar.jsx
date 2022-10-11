import React, { useEffect, useState } from "react";
import MainLayout from "../../../../layout/MainLayout";
import { Row, Col, Breadcrumb, Button, Switch } from "antd";
import { useRouter } from "next/router";
import moment from "moment";
import { ArrowLeftOutlined } from "@ant-design/icons";
import WebApiPayroll from "../../../../api/WebApiPayroll";
import Calendar from "rc-year-calendar";

const Calendars = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [minDate, setMinDate] = useState(new Date("01/01/2021"));
  const [maxDate, setMaxDate] = useState(null);
  const [language, setLanguage] = useState("es");
  const [style, setStyle] = useState("border");
  const [allowOverlap, setAllowOverlap] = useState(true);
  const [enableRangeSelection, setEnableRangeSelection] = useState(false);
  const [displayWeekNumber, setDisplayWeekNumber] = useState(false);
  const [roundRangeLimits, setRoundRangeLimits] = useState(false);
  const [alwaysHalfDay, setAlwaysHalfDay] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const route = useRouter();

  useEffect(() => {
    if (route.query.id) getPaymentCalendars();
  }, [route.query]);

  useEffect(() => {}, [style]);

  const changeStyle = () => {
    if (style == "border") {
      setStyle("background");
    } else {
      setStyle("border");
    }
    setIsChecked(!isChecked);
  };

  const getPaymentCalendars = async () => {
    await WebApiPayroll.getDetailPaymentCalendar(route.query.id)
      .then((response) => {
        let data = response.data;
        let dataSource = [];
        data.periods.map((a) => {
          dataSource.push({
            startDate: new Date(moment(a.start_date).format("MM/DD/YYYY")),
            endDate: new Date(moment(a.end_date).format("MM/DD/YYYY")),
          });

          if (a.incidences) {
            dataSource.push({
              startDate: new Date(
                moment(a.incidences.start_date).format("MM/DD/YYYY")
              ),
              endDate: new Date(
                moment(a.incidences.end_date).format("MM/DD/YYYY")
              ),
              color: "orange",
            });
          }

          dataSource.push({
            startDate: new Date(moment(a.payment_date).format("MM/DD/YYYY")),
            endDate: new Date(moment(a.payment_date).format("MM/DD/YYYY")),
            color: "red",
          });
        });
        setDataSource(dataSource);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <MainLayout currentKey={["paymentCalendar"]} defaultOpenKeys={["payroll"]}>
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Nómina</Breadcrumb.Item>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/payroll/paymentCalendar" })}
        >
          Calendario de pagos
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="container-border-radius" style={{ width: "100%" }}>
        <>
          <Row>
            <Col span={24}>
              <div style={{ padding: "1%", float: "right" }}>
                <Button
                  style={{
                    background: "#fa8c16",
                    fontWeight: "bold",
                    color: "white",
                    marginTop: "auto",
                    float: "left",
                  }}
                  onClick={() =>
                    route.push({ pathname: "/payroll/paymentCalendar" })
                  }
                  key="back"
                >
                  <ArrowLeftOutlined />
                  Regresar
                </Button>
              </div>
            </Col>
            <Col span={24}>
              <div style={{ padding: "1%", textAlign: "center" }}>
                <h2>{currentYear}</h2>
              </div>
            </Col>
            <Col span={24}>
              <p>Borde/Relleno</p>
              <Switch
                defaultChecked
                checked={isChecked}
                onChange={changeStyle}
              />
            </Col>
          </Row>

          <Row justify="center">
            <Col span={24} style={{ display: "flex" }}>
              <Calendar
                language="es"
                year={currentYear}
                minDate={minDate}
                maxDate={maxDate}
                style={style}
                allowOverlap={allowOverlap}
                enableRangeSelection={enableRangeSelection}
                displayWeekNumber={displayWeekNumber}
                roundRangeLimits={roundRangeLimits}
                alwaysHalfDay={alwaysHalfDay}
                displayHeader={false}
                dataSource={dataSource}
              />
            </Col>
          </Row>
        </>
      </div>
    </MainLayout>
  );
};

export default Calendars;
