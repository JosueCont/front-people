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
