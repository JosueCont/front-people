import React, { useEffect } from "react";
import FormPersonDetail from "../../components/person/FormPersonDetail";
import { withAuthSync } from "../../libs/auth";

const EmployeeDetailPage = () => {
  return (
    <>
      <FormPersonDetail />
    </>
  );
};

export default withAuthSync(EmployeeDetailPage);
