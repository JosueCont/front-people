import { Button, Row, Select } from "antd";
import { API_URL_TENANT } from "../../../config/config";
import { SuaMovementsType } from "../../../utils/constant";
import { downLoadFileBlob, getDomain } from "../../../utils/functions";

const SuaMovements = () => {
  const dowloadFile = () => {
    downLoadFileBlob(
      `${getDomain(API_URL_TENANT)}/payroll/sua-movements`,
      "SuaMove.txt",
      "POST",
      {
        type: 1,
        patronal_id: "6e7bbe13e35a465089188a2b6f58a280",
        list: [
          "da04fc20f0884fd0b6211a5fd006a4dd",
          "ca9abe25680b451ca9603176732e2b6d",
        ],
      }
    );
  };
  return (
    <>
      <Button onClick={() => dowloadFile()}>SUA</Button>
      <Row style={{ padding: "20px" }}>
        <Select
          placeholder="Tipo de movimiento"
          options={SuaMovementsType}
          allowClear
        />
      </Row>
    </>
  );
};

export default SuaMovements;
