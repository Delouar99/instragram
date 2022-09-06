import axios from "axios";

//send sms

export const Sendsms = async (number, message) => {

    try {
        await axios.get(`https://bulksmsbd.net/api/smsapi?api_key=K8YZb6ZDUf8cfBY8nPW9&type=text&number=${number}&senderid=	03590002777&message=${message}`)
    } catch (error) {
        console.log(error);
    }

}