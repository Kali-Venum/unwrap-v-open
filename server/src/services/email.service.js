const SibApiV3Sdk = require("sib-api-v3-sdk");
const config = require("../configs/index");

// Set up Sendinblue API client and API key
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = config.bravo.api_key;

const sendOTPUsingEmail = async (email, OTP, subject) => {
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let SendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  SendSmtpEmail = {
    sender: {
      name: "no-reply",
      email: config.bravo.email_from,
    },
    to: [
      {
        email: email,
        name: "John Doe",
      },
    ],
    subject: subject,
    htmlContent: `<html><head></head><body><h1>${OTP}</h1></body></html>`,
    headers: {
      "X-Mailin-custom":
        "custom_header_1:custom_value_1|custom_header_2:custom_value_2|custom_header_3:custom_value_3",
      charset: "iso-8859-1",
    },
  };

  try {
    const data = await apiInstance.sendTransacEmail(SendSmtpEmail);
    console.log("API called successfully. Returned data: ", data);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

module.exports = {
  sendOTPUsingEmail,
};
