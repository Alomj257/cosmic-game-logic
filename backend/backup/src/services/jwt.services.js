import jwt from 'jsonwebtoken';

const generateToken = (payload, secret, expiry) => {
    return jwt.sign(payload, secret, { expiresIn: expiry });
};

const verify = (token, secret) => {
    return jwt.verify(token, secret);
};

const decode = (token) => {
    return jwt.decode(token);
};

export const jwtServices = {
    generateToken,
    verify,
    decode,
};