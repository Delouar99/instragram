import axios from "axios";

//Register confermation Otp

export const SenOTP = async (cell, sms) => {
  try {
    await axios.get(
      `https://bulksmsbd.net/api/smsapi?api_key=${process.env.sms_api_key}&type=${process.env.sms_TYPEy}&number=${cell}&senderid=${process.env.sms_senderID}&message=${sms}`
    );
  } catch (error) {
    console.log(error);
  }
};
