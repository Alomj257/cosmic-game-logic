export const publicRoutes = [
    '/auth/register',
    '/auth/login',
    '/auth/forgotpassword',
    '/auth/verifyotp',
    '/auth/resetpassword',
    /^\/image\/\d+[^\/]*$/,
    // /^\/book\/getallcontent\/[a-fA-F0-9]{24}$/, 
    // /^\/book\/getnamelist\/[a-fA-F0-9]{24}$/
];

const _roles = {
    ADMIN: "ADMIN",
    BOOK_READER: "BOOK_READER",
    SILVER: "SILVER",
    GOLD: "GOLD",
    BASIC: "BASIC",
};

export const roles = Object.freeze(_roles);
