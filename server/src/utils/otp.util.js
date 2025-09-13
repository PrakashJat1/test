
 const generateotp = () => Math.floor(100000 + Math.random() * 900000);

 const validateotp = (user,entered_otp) =>  entered_otp === user.otp && user.otpExpiry > Date.now();

export default {
    generateotp,
    validateotp
}