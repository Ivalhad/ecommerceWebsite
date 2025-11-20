const cookieOptions = (req) => {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProduction && req.hostname !== "localhost",
        sameSite: "strict",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    };
};

export default cookieOptions;