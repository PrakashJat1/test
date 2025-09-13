import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = async (request, response, next) => {
  const authHeader =
    request.headers.Authorization || request.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];

    if (!token) {
      response
        .status(401)
        .json({ massage: "Token missing authorization denied" });
    }

    try {
      //decode & attach the user info from token
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      request.user = decode;
      console.log("Decoded  user : ",request.user);
      next();
    } catch (error) {
      response.status(401).json({ massage: "Invalid or expired Token" });
    }
  }else{
      response
        .status(401)
        .json({ massage: "Token missing authorization denied" });
    }
};
