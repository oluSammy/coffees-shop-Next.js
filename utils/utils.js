export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};


export const transformData = (data) => {
  return data.map((record) => {
    return { recordId: record.id, ...record.fields };
  });
};