import { APP_ID } from "../config/config";

export const ruleRequired = {
  required: true,
  message: "Este campo es requerido",
};

export const ruleEmail = {
  type: "email",
  message: "Ingrese un correo electrónico válido",
};

export const onlyNumeric = {
  pattern: /^[0-9]*$/,
  message: "Ingrese un valor numérico.",
};

export const twoDigit = {
  pattern: /^[0-9]{0,2}$/,
  message: "El campo debe tener 2 dígitos numéricos",
};

export const treeDecimal = {
  pattern: /^\d+(?:\.\d{1,3})?$/,
  message: "El campo no puede tener más de tres decimales",
};

// {pattern: /^[\d]{0,16}$/, message: "El no  debe tener más de 16 dígitos" }, numero menor  a 16 digitos

export const curpFormat = {
  pattern:
    /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
  message: "CURP no válido.",
};
export const rfcFormat = {
  pattern:
    /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/,
  message: "RFC no válido.",
};

export const minLengthNumber = {
  pattern: /^[0-9]{11}$/,
  message: "El valor ingresado no puede ser menor a 11 caracteres.",
};

export const titleDialogDelete = "¿Está seguro de eliminarlo?";

export const messageDialogDelete =
  "Al eliminar este registro se perderán todos los datos relacionados de manera permanente.";

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
export const statusSelect = [
  {
    label: "Todos",
    value: -1,
  },
  {
    label: "Activos",
    value: true,
  },
  {
    label: "Inactivos",
    value: false,
  },
];

export const periodicityNom = [
  {
    label: "Diaria",
    value: 1,
  },
  {
    label: "Semanal",
    value: 2,
  },
  {
    label: "Decenal",
    value: 3,
  },
  {
    label: "Catorcenal",
    value: 4,
  },
  {
    label: "Quincenal",
    value: 5,
  },
  {
    label: "Mensual",
    value: 6,
  },
  {
    label: "Anual",
    value: 7,
  },
];

export const generateYear = () => {
  let yearsArray = [];
  let currentYear = new Date().getFullYear();
  let startYear = currentYear - 10;
  while (startYear < currentYear) {
    startYear++;
    yearsArray.push({ label: `${startYear}`, value: startYear });
  }
  return yearsArray.reverse();
};

export const headersApi = () => {
  return {
    "client-id": APP_ID,
    "Content-Type": "application/json",
  };
};

export const monthsName = [
  {
    label: "Enero",
    value: 1,
  },
  {
    label: "Febrero",
    value: 2,
  },
  {
    label: "Marzo",
    value: 3,
  },
  {
    label: "Abril",
    value: 4,
  },
  {
    label: "Mayo",
    value: 5,
  },
  {
    label: "Junio",
    value: 6,
  },
  {
    label: "Julio",
    value: 7,
  },
  {
    label: "Agosto",
    value: 8,
  },
  {
    label: "Septiembre",
    value: 9,
  },
  {
    label: "Octubre",
    value: 10,
  },
  {
    label: "Noviembre",
    value: 11,
  },
  {
    label: "Diciembre",
    value: 12,
  },
];

export const messageSaveSuccess = "Agregado correctamente.";
export const messageUpdateSuccess = "Actualizado correctamente.";
export const messageDeleteSuccess = "Eliminado correctamente.";
export const messageError = "Ocurrio un error, intente de nuevo.";
