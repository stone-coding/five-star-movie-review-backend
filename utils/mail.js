const SibApiV3Sdk = require("sib-api-v3-sdk");
const nodemailer = require("nodemailer");

exports.generateOTP = (OTP_length = 6) => {
  let OTP = "";
  for (let i = 1; i <= OTP_length; i++) {
    const randomValue = Math.round(Math.random() * 9);
    OTP += randomValue;
  }
  return OTP;
};

exports.generateMailTransporter = () =>
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASS,
    },
  });

exports.sendEmail = async (name, email, subject, htmlContent) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;

  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.SIB_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = {
    name: "Five Star MRP",
    email: process.env.OFFICIAL_EMAIL,
  };
  sendSmtpEmail.to = [{ email, name }];

  return await apiInstance.sendTransacEmail(sendSmtpEmail)
};
