import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

//create admin
const createAdminService = async () => {
  try {
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const admin = await new User({
        fullName: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        status: true,
        otp: null,
        isverified: true,
      }).save();
      console.log("Admin created");
    } else {
      console.log("Admin is already created");
    }
  } catch (error) {
    console.log("Error in admin creation  \n" + error);
  }
};

export default {
  createAdminService,
};
