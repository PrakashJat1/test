import jwt from 'jsonwebtoken';

 const jwtTokenGeneration = async (userId,role) => {
     return  jwt.sign(
            {userId ,role },
            process.env.JWT_SECRET,
            {expiresIn :  '7d' }
        )
}

export default {
    jwtTokenGeneration
}