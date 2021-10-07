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

export const asyncForEach = async(array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}