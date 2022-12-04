//email validate

// export const isEmail = (email) =>{
//    return email.toLowerCase().match(/^[^\.-/][a-z0-9-_\.]{1,}@[a-z0-9]{1,}\.[a-z\.]{2,}$/);

// }

//email validate

export const isEmail = (email) => {
  return /^[^\.-/][a-z0-9-_\.]{1,}@[a-z0-9]{1,}\.[a-z\.]{2,}$/.test(email);
};

//mobile validate

export const isMobile = (mobile) => {
  return /^(01|8801|\+8801)[0-9]{1,}$/.test(mobile);
};

//is string validate
export const isString = (data) => {
  return /^[a-z@\.]{1,}$/.test(data);
};

//isNumber alidate
export const isNumber = (number) => {
  return /^[0-9\+]{1,}$/.test(number);
};
