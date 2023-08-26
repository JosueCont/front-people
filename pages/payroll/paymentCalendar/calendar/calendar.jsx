import React, { useEffect, useState } from "react";
import MainLayout from "../../../../layout/MainInter";
import { Row, Col, Breadcrumb, Button, Switch } from "antd";
import { useRouter } from "next/router";
import moment from "moment";
import { ArrowLeftOutlined } from "@ant-design/icons";
import WebApiPayroll from "../../../../api/WebApiPayroll";
import Calendar from "rc-year-calendar";
import 'rc-year-calendar/locales/rc-year-calendar.es'
import { verifyMenuNewForTenant } from "../../../../utils/functions";

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
  const [bankDays, setBankDays] = useState([])
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

  const vaidateBankDay = (payment_date, ) => {

  }

  const getPaymentCalendars = async () => {
    await WebApiPayroll.getDetailPaymentCalendar(route.query.id)
      .then((response) => {
        let data = response.data;
        let dataSource = [];
        let bank_days = data.bank_days
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

          let payment_date = moment(a.payment_date)
          
          /* Si existen dias inhábiles bancarios */
          if(bank_days){
            for (let i = 0; i < bank_days?.length; i++) {
              if (moment(bank_days[i].date).format("DD/MM/YYYY") === payment_date.format("DD/MM/YYYY")){
                payment_date = payment_date.subtract(1,'days')
              }
            }
          }

          /* Realizamos la validaciones de pago en domingo */
          let numberDay = payment_date.day()

          /* Validamos si es domingo y si se puede pagar domingo */
          if(numberDay === 0 && data.payment_sunday === false){
            /* Si no se puede, regresamos un dia */
            payment_date = payment_date.subtract(1,'days')
          }

          /* Validamos si podemos pagar sabados */
          numberDay = payment_date.day()
          if(numberDay === 6 && data.payment_saturday === false){
            /* Si no se puede, regresamos un dia */
            payment_date = payment_date.subtract(1,'days')
          }

          /* Volvemos a validar dias inhábiles bancarios */
          if(bank_days){
            for (let i = 0; i < bank_days?.length; i++) {
              if (moment(bank_days[i].date).format("DD/MM/YYYY") === payment_date.format("DD/MM/YYYY")){
                payment_date = payment_date.subtract(1,'days')
              }
            }
          }


          /* Periodo de pago */
          let paymentPeriod = {
            startDate: new Date(payment_date.format("MM/DD/YYYY")),
            endDate: new Date(payment_date.format("MM/DD/YYYY")),
            color: "red",
          }

          console.log('paymentPeriod',paymentPeriod)

          dataSource.push(paymentPeriod);
        });
        console.log('dataSource=========',dataSource)
        setDataSource(dataSource);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <MainLayout currentKey={["paymentCalendar"]} defaultOpenKeys={["managementRH","payroll"]}>
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        {verifyMenuNewForTenant() && 
          <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
        }
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
