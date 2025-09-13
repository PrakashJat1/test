import axios from "@/utils/axios";

const login = async (data) => {
  return await axios.post("/api/auth/login", data);
};

const fetchLoggedInUser = async () => {
  return await axios.get("/api/auth/loggedInUser");
};

const resetPassword = async (data) => {
  return await axios.post("/api/auth/forget-password", data);
};

const registeritepapplicant = async (data) => {
  const formData = new FormData();

  // Append all normal text fields
  for (let key in data) {
    if (
      key !== "photo" &&
      key !== "documentsPDF" &&
      key !== "fatherIncomeCerificate"
    ) {
      formData.append(key, data[key]);
    }
  }

  // Append files separately
  if (data.photo?.[0]) formData.append("photo", data.photo[0]);
  if (data.documentsPDF?.[0])
    formData.append("documentsPDF", data.documentsPDF[0]);
  if (data.fatherIncomeCerificate?.[0])
    formData.append("fatherIncomeCerificate", data.fatherIncomeCerificate[0]);

  // Send as multipart/form-data
  return await axios.post("/api/auth/registeritepapplicant", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const verifyOTP = async (data) =>{
  return await axios.post('/api/auth/verify-otp',data);
}

const resendOTP = async (data) => {
  return await axios.post('/api/auth/resend-otp',data);
}

export default {
  login,
  fetchLoggedInUser,
  resetPassword,
  registeritepapplicant,
  verifyOTP,
  resendOTP
};
