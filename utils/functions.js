import WebApi from "../api/webApi";

export const genders = [
  {
    label: "Masculino",
    value: 1,
  },
  {
    label: "Femenino",
    value: 2,
  },
  {
    label: "Otro",
    value: 3,
  },
];
export const civilStatus = [
  {
    label: "Soltero(a)",
    value: 1,
  },
  {
    label: "Casado(a)",
    value: 2,
  },
  {
    label: "Viudo(a)",
    value: 3,
  },
];
export const typePhones = [
  {
    label: "Alterno",
    value: 1,
  },
  {
    label: "Principal",
    value: 2,
  },
  {
    label: "Recados",
    value: 3,
  },
];
export const typeLines = [
  {
    label: "Celular",
    value: 1,
  },
  {
    label: "Fijo",
    value: 2,
  },
];
export const typeStreet = [
  {
    label: "Avenida",
    value: 1,
  },
  {
    label: "Boulevard",
    value: 2,
  },
  {
    label: "Calle",
    value: 3,
  },
];
export const periodicity = [
  {
    label: "Semanal",
    value: 1,
  },
  {
    label: "Catorcenal",
    value: 2,
  },
  {
    label: "Quincenal",
    value: 3,
  },
  {
    label: "Mensual",
    value: 4,
  },
];

export const getJobForSelect = async (id) => {
  try {
    let response = await WebApi.getJobSelect(id);
    let job = response.data;
    job = job.map((a) => {
      return { label: a.name, value: a.id };
    });
    return job;
  } catch (error) {
    return [];
  }
};

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const UserPermissions = (data) => {
  try {
    let perms = {
      person: {
        view: false,
        create: false,
        edit: false,
        delete: false,
        change_is_active: false,
        export_csv_person: false,
        import_csv_person: false,
      },
      company: {
        view: false,
        create: false,
        edit: false,
        delete: false,
        change_is_active: false,
      },
      groups: {
        view: false,
        create: false,
        edit: false,
        delete: false,
        approve_account: false,
        reject_account: false,
      },
      requestaccount: {
        view: false,
        create: false,
        edit: false,
        delete: false,
        approve_account: false,
        reject_account: false,
      },
      person_type: { view: false, create: false, edit: false, delete: false },
      department: { view: false, create: false, edit: false, delete: false },
      job: { view: false, create: false, edit: false, delete: false },
      relationship: { view: false, create: false, edit: false, delete: false },
      bank: { view: false, create: false, edit: false, delete: false },
      document_type: { view: false, create: false, edit: false, delete: false },
      payrollvoucher: {
        view: false,
        create: false,
        edit: false,
        delete: false,
        import_payrollvoucher: false,
      },
      comunication: { view: false, create: false, edit: false, delete: false },
      event: { view: false, create: false, edit: false, delete: false },
      loan: {
        view: false,
        create: false,
        edit: false,
        delete: false,
        approve_loan: false,
        reject_loan: false,
        approve_loan_pay: false,
      },
      loanconfigure: { view: false, create: false, edit: false, delete: false },
      vacation: {
        view: false,
        create: false,
        edit: false,
        delete: false,
        approve_vacation: false,
        reject_vacation: false,
      },
      permit: {
        view: false,
        create: false,
        edit: false,
        delete: false,
        approve_permit: false,
        reject_permit: false,
      },
      incapacity: {
        view: false,
        create: false,
        edit: false,
        delete: false,

        approve_incapacity: false,
        reject_incapacity: false,
      },
      report: {
        view: false,
        create: false,
        edit: false,
        delete: false,
        export_collaborators: false,
        export_payrolls: false,
        export_loans: false,
        export_vacations: false,
        export_inabilitys: false,
        export_permits: false,
      },

      intranet: {
        dashboard: { statistics: false },
      },
    };
    data.map((a) => {
      console.log("item--- >> ", a);
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
    return [];
  }
};
