import { useState } from "react";

export const useGetCompanyId = () => {
  const [companyId, setCompanyId] = useState(null);

  const getCompanyId = () => {
    if (sessionStorage.getItem("data")) {
      setCompanyId(sessionStorage.getItem("data"));
    }
  };

  return {
    companyId,
    getCompanyId,
  };
};
