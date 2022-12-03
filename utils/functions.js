import axios from "axios";
import WebApiPeople from "../api/WebApiPeople";
import { message } from "antd";
import { typeHttp } from "../config/config";

export const generateYear = (year_init = 2020) => {
  let yearsArray = [];
  let currentYear = new Date().getFullYear();
  let startYear = year_init;
  while (startYear < currentYear) {
    startYear++;
    yearsArray.push({ label: `${startYear}`, value: startYear });
  }
  return yearsArray.reverse();
};

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const downLoadFileBlob = async (
  url,
  name = "Example.xlsx",
  type = "POST",
  params = null,
  Textmessage = null
) => {
  let headers = {
    method: type,
    responseType: "blob",
  };
  if (params) headers.data = params;
  axios(
    url.toLowerCase().includes("http") ? url : `${typeHttp}://` + url,
    headers
  )
    .then((response) => {
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = name;
      link.click();
    })
    .catch((e) => {
      Textmessage && message.error(Textmessage) 
      console.log(e);
    });
};

export const UserPermissions = (permits = null, is_admin = false) => {
  let perms = {
    person: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
      change_is_active: is_admin,
      export_csv_person: is_admin,
      import_csv_person: is_admin,
    },
    company: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
      change_is_active: is_admin,
    },
    groups: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
      approve_account: is_admin,
      reject_account: is_admin,
    },
    requestaccount: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
      approve_account: is_admin,
      reject_account: is_admin,
    },
    person_type: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
    },
    department: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
    },
    job: { view: is_admin, create: is_admin, edit: is_admin, delete: is_admin },
    relationship: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
    },
    bank: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
    },
    document_type: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
    },
    payrollvoucher: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
      import_payrollvoucher: is_admin,
    },
    comunication: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
    },
    event: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
    },
    loan: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
      approve_loan: is_admin,
      reject_loan: is_admin,
      approve_loan_pay: is_admin,
    },
    loanconfigure: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
    },
    vacation: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
      approve_vacation: is_admin,
      reject_vacation: is_admin,
    },
    permit: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
      approve_permit: is_admin,
      reject_permit: is_admin,
    },
    incapacity: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,

      approve_incapacity: is_admin,
      reject_incapacity: is_admin,
    },
    report: {
      view: is_admin,
      create: is_admin,
      edit: is_admin,
      delete: is_admin,
      export_collaborators: is_admin,
      export_payrolls: is_admin,
      export_loans: is_admin,
      export_vacations: is_admin,
      export_inabilitys: is_admin,
      export_permits: is_admin,
    },
    intranet: {
      dashboard: { statistics: is_admin },
    },
  };
  if (is_admin || !permits) {
    return perms;
  }
  try {
    permits.map((a) => {
      if (a == "people.company.can.view") perms.company.view = true;
      else if (a == "people.company.can.create") perms.company.create = true;
      else if (a == "people.company.can.edit") perms.company.edit = true;
      else if (a == "people.company.can.delete") perms.company.delete = true;
      else if (a == "people.company.function.change_is_active")
        perms.company.change_is_active = true;
      else if (a == "people.groups.can.create") perms.groups.create = true;
      else if (a == "people.groups.can.edit") perms.groups.edit = true;
      else if (a == "people.groups.can.delete") perms.groups.delete = true;
      else if (a == "people.groups.can.view") perms.groups.view = true;
      else if (a == "people.requestaccount.can.view")
        perms.requestaccount.view = true;
      else if (a == "people.requestaccount.can.create")
        perms.requestaccount.create = true;
      else if (a == "people.requestaccount.can.edit")
        perms.requestaccount.edit = true;
      else if (a == "people.requestaccount.function.approve_account")
        perms.requestaccount.approve_account = true;
      else if (a == "people.requestaccount.function.reject_account")
        perms.requestaccount.reject_account = true;
      else if (a == "people.requestaccount.can.delete")
        perms.requestaccount.delete = true;
      else if (a == "people.person.can.view") perms.person.view = true;
      else if (a == "people.person.can.create") perms.person.create = true;
      else if (a == "people.person.can.edit") perms.person.edit = true;
      else if (a == "people.person.can.delete") perms.person.delete = true;
      else if (a == "people.person.function.change_is_active")
        perms.person.change_is_active = true;
      else if (a == "people.person.function.export_csv_person")
        perms.person.export_csv_person = true;
      else if (a == "people.person.function.import_csv_person")
        perms.person.import_csv_person = true;
      else if (a == "people.person_type.can.view")
        perms.person_type.view = true;
      else if (a == "people.person_type.can.create")
        perms.person_type.create = true;
      else if (a == "people.person_type.can.edit")
        perms.person_type.edit = true;
      else if (a == "people.person_type.can.delete")
        perms.person_type.delete = true;
      else if (a == "people.department.can.view") perms.department.view = true;
      else if (a == "people.department.can.create")
        perms.department.create = true;
      else if (a == "people.department.can.edit") perms.department.edit = true;
      else if (a == "people.department.can.delete")
        perms.department.delete = true;
      else if (a == "people.job.can.delete") perms.job.delete = true;
      else if (a == "people.job.can.edit") perms.job.edit = true;
      else if (a == "people.job.can.create") perms.job.create = true;
      else if (a == "people.job.can.view") perms.job.view = true;
      else if (a == "people.relationship.can.delete")
        perms.relationship.delete = true;
      else if (a == "people.relationship.can.edit")
        perms.relationship.edit = true;
      else if (a == "people.relationship.can.create")
        perms.relationship.create = true;
      else if (a == "people.relationship.can.view")
        perms.relationship.view = true;
      else if (a == "people.bank.can.view") perms.bank.view = true;
      else if (a == "people.bank.can.create") perms.bank.create = true;
      else if (a == "people.bank.can.edit") perms.bank.edit = true;
      else if (a == "people.bank.can.delete") perms.bank.delete = true;
      else if (a == "people.document_type.can.delete")
        perms.document_type.delete = true;
      else if (a == "people.document_type.can.edit")
        perms.document_type.edit = true;
      else if (a == "people.document_type.can.create")
        perms.document_type.create = true;
      else if (a == "people.document_type.can.view")
        perms.document_type.view = true;
      else if (a == "people.payrollvoucher.can.view")
        perms.payrollvoucher.view = true;
      else if (a == "people.payrollvoucher.can.create")
        perms.payrollvoucher.create = true;
      else if (a == "people.payrollvoucher.can.edit")
        perms.payrollvoucher.edit = true;
      else if (a == "people.payrollvoucher.can.delete")
        perms.payrollvoucher.delete = true;
      else if (a == "people.payrollvoucher.function.import_payrollvoucher")
        perms.payrollvoucher.import_payrollvoucher = true;
      else if (a == "people.comunication.can.view")
        perms.comunication.view = true;
      else if (a == "people.comunication.can.create")
        perms.comunication.create = true;
      else if (a == "people.comunication.can.edit")
        perms.comunication.edit = true;
      else if (a == "people.comunication.can.delete")
        perms.comunication.delete = true;
      else if (a == "people.event.can.delete") perms.event.delete = true;
      else if (a == "people.event.can.edit") perms.event.edit = true;
      else if (a == "people.event.can.create") perms.event.create = true;
      else if (a == "people.event.can.view") perms.event.view = true;
      else if (a == "people.loan.can.view") perms.loan.view = true;
      else if (a == "people.loan.can.create") perms.loan.create = true;
      else if (a == "people.loan.can.edit") perms.loan.edit = true;
      else if (a == "people.loan.can.delete") perms.loan.delete = true;
      else if (a == "people.loan.function.approve_loan")
        perms.loan.approve_loan = true;
      else if (a == "people.loan.function.reject_loan")
        perms.loan.reject_loan = true;
      else if (a == "people.loan.function.approve_loan_pay")
        perms.loan.approve_loan_pay = true;
      else if (a == "people.loanconfigure.can.delete")
        perms.loanconfigure.delete = true;
      else if (a == "people.loanconfigure.can.edit")
        perms.loanconfigure.edit = true;
      else if (a == "people.loanconfigure.can.create")
        perms.loanconfigure.create = true;
      else if (a == "people.loanconfigure.can.view")
        perms.loanconfigure.view = true;
      else if (a == "people.vacation.can.delete") perms.vacation.delete = true;
      else if (a == "people.vacation.can.edit") perms.vacation.edit = true;
      else if (a == "people.vacation.can.create") perms.vacation.create = true;
      else if (a == "people.vacation.can.view") perms.vacation.view = true;
      else if (a == "people.vacation.function.approve_vacation")
        perms.vacation.approve_vacation = true;
      else if (a == "people.vacation.function.reject_vacation")
        perms.vacation.reject_vacation = true;
      else if (a == "people.permit.can.delete") perms.permit.delete = true;
      else if (a == "people.permit.can.edit") perms.permit.edit = true;
      else if (a == "people.permit.can.create") perms.permit.create = true;
      else if (a == "people.permit.can.view") perms.permit.view = true;
      else if (a == "people.permit.function.approve_permit")
        perms.permit.approve_permit = true;
      else if (a == "people.permit.function.reject_permit")
        perms.permit.reject_permit = true;
      else if (a == "people.incapacity.can.delete")
        perms.incapacity.delete = true;
      else if (a == "people.incapacity.can.edit") perms.incapacity.edit = true;
      else if (a == "people.incapacity.can.create")
        perms.incapacity.create = true;
      else if (a == "people.incapacity.can.view") perms.incapacity.view = true;
      else if (a == "people.incapacity.function.approve_incapacity")
        perms.incapacity.approve_incapacity = true;
      else if (a == "people.incapacity.function.reject_incapacity")
        perms.incapacity.reject_incapacity = true;
      else if (a == "people.report.function.export_collaborators")
        perms.report.export_collaborators = true;
      else if (a == "people.report.function.export_payrolls")
        perms.report.export_payrolls = true;
      else if (a == "people.report.function.export_loans")
        perms.report.export_loans = true;
      else if (a == "people.report.function.export_vacations")
        perms.report.export_vacations = true;
      else if (a == "people.report.function.export_inabilitys")
        perms.report.export_inabilitys = true;
      else if (a == "people.report.function.export_permits")
        perms.report.export_permits = true;
      else if (a == "intranet.dashboard.function.statistics")
        perms.intranet.dashboard.statistics = true;
    });
    return perms;
  } catch {
    return perms;
  }
};

export const getDomain = (api) => {
  try {
    let tenat = window.location.hostname.split(".")[0];
    return `${tenat}.${api}`;
  } catch (error) {
    return "error";
  }
};

export const numberFormat = (value) =>
  new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const getDifferenceDays = (startDate, endDate) => {
  let date1 = new Date(startDate);
  let date2 = new Date(endDate);
  // To calculate the time difference of two dates
  let Difference_In_Time = date2.getTime() - date1.getTime();
  // To calculate the no. of days between two dates
  let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

  return Difference_In_Days;
};

export const valueToFilter = (value) => {
  let newVal = value
    ? value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
    : "";
  return newVal.trim();
};

export const arrayToSelect = (
  data = [],
  valueItem = "id",
  keyitem = "",
  labelItem = "Item"
) => {
  const newData = data.map((item) => {
    return {
      value: item[valueItem],
      key: item[keyitem],
      label: item[labelItem],
    };
  });
  return newData;
};

export const getFullName = (item) => {
  let { first_name, flast_name, mlast_name, email } = item;
  if (first_name && flast_name && mlast_name) {
    return `${first_name} ${flast_name} ${mlast_name}`;
  } else if (first_name && flast_name) {
    return `${first_name} ${flast_name}`;
  } else if (first_name && mlast_name) {
    return `${first_name} ${mlast_name}`;
  } else {
    return email;
  }
};

export const getPhoto = ({ photo }) => {
  return photo ? photo : "/images/usuario.png";
};

export const getWork = ({ work_title }) => {
  return work_title ? (work_title.job ? work_title.job.name : "N/A") : "N/A";
};

export const validateNum = (e) =>{
  if(e.which != 8
    && isNaN(String.fromCharCode(e.which))
  ) e.preventDefault();
}

export const validateMaxLength = (e) =>{
  if(e.target.maxLength
    && e.target.maxLength
    == e.target.value.length
  ) e.preventDefault();
}

export const createFiltersJB = (obj = {}) =>{
  let noValid = [undefined, null, '', ' '];
  return Object.entries(obj).reduce((query, [key, val])=>{
    if(noValid.includes(val)) return query;
    let value = val.toString().trim();
    return {...query, [key]: value}
  }, {});
}

export const getFiltersJB = (obj = {}) =>{
  return Object.entries(obj).reduce((query, [key, val])=>{
    if(key == 'page'){
      let offset = (parseInt(val) - 1) * 10;
      return query +=`&limit=10&offset=${offset}`;
    }
    return query += `&${key}=${val}`;
  }, '');
}

export const deleteFiltersJb = (
  filters = {},
  listDelete = ['id','client','vacancy']
) =>{
  let newFilters = {...filters};
  const remove = item => {
    if(newFilters[item]) delete newFilters[item]
  };
  listDelete.forEach(remove);
  return newFilters;
}
