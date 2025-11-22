import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/response.js";
import cookieOptions from "../utils/cookieOptions.js";
import express from "express";

//register
const register = async (req, res) => {
    const { name, email, password } = req.body;

    //check if user exists
    const existedUser =  await prisma.user.findUnique({where: { email }});
    if (existedUser) {
        return errorResponse(res,null, 400, "User already exists");
    }

    //hash password
    const hashed = await bcrypt.hash(password, 10);

    //save user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashed,
        },
    });

    return successResponse(res, "User registered successfully",{ id: user.id, name: user.name, email: user.email });
};

//login
const login = async (req, res) => {
    const { email, password } = req.body;

    //check if user exists
    const user =  await prisma.user.findUnique({where: { email }});
    if (!user) {
        return errorResponse(res,null, 400, "Invalid email or password");
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return errorResponse(res,null, 400, "Invalid email or password");
    }

    return successResponse(res, "Login successful", { id: user.id, name: user.name, email: user.email });
}

export { register, login };