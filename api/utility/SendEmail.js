import nodemailer from 'nodemailer'


//create email
export const SendEmail = async (to, subject, text) =>{
  try {
    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "reactdemo98@gmail.com",
        pass: "zmdevyzxgkltxuvu"
      }
    });

  await transport.sendMail({
      from : 'delouar1998@gmail.com',
      to : to,
      subject : subject,
      text : text
    })

  } catch (error) {
    console.log(error);
  }

}



