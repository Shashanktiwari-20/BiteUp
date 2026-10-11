const nodeMailer = require("nodemailer");
const config = require("../Config/config");

const transporter = nodeMailer.createTransport({
    service:'gmail',
    auth: {
        type: 'OAuth2',
        user: config.GOOGLE_USER,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN
    }
})

transporter.verify((error,success) => {
    if(error){
        console.error(error)
    }
    else{
        console.log("transport verification : ",success)
    }
})

const sendEmail = async (to,subject,text,html)=> {
    try{
        const info = await transporter.sendMail({
            from : `"BiteUp" <${config.GOOGLE_USER}>`,
            to: to,
            subject: subject,
            html: html

        })
        console.log("message sent : %s", info.messageId)
    }catch(error){
        console.error(error);
        throw error;
    }
}

async function registrationSucessEmail(to,name){
    const subject = "Welcome to BiteUp";
    const text = `Hello ${name},\n\nThank you for registering at BiteUp. We're excited to have you on board!\n\nBest regards,\nThe BiteUp Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering at BiteUp. We're excited to have you on board!</p><p>Best regards,<br>The BiteUp Team</p>`;

    await sendEmail(to, subject, text ,html);
}

module.exports = {sendEmail,registrationSucessEmail}