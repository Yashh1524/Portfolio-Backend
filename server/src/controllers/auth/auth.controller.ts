import bcrypt from "bcryptjs";
import { Request, RequestHandler, Response } from "express";
import {
	access_tokenOptions,
	generate_access_token,
} from "../../helpers/jwtGenerate";
import Admin from "../../models/admin";
import env from "../../utils/env";
import { adminSchema, loginSchema } from "../../validations/authValidation";

// // register
// const registerUser: RequestHandler = async (req: Request, res: Response) => {
// 	const { error, data, success } = adminSchema.safeParse(req.body);

// 	if (!success || error) {
// 		res.status(400).json({ success: false, message: error.flatten().fieldErrors });
// 		return;
// 	}
// 	try {
// 		// check if user already exists
// 		const existingUser = await Admin.findOne({ email: data?.email });

// 		if (existingUser) {
// 			res.status(409).json({ success: false, message: "User already exists" });
// 			return;
// 		}

// 		// hash password
// 		const hashedPassword = await bcrypt.hash(data?.password, 10);

// 		const admin = {
// 			username: data?.username,
// 			email: data?.email,
// 			password: hashedPassword,
// 		};

// 		const newAdmin = new Admin(admin);
// 		await newAdmin.save();

// 		res.status(201).json({ success: true, message: "User registered" });
// 	} catch (error: any) {
// 		res.status(500).json({ success: false, message: error.message });
// 	}
// };

// login controller
const loginUser: RequestHandler = async (req: Request, res: Response) => {
	const { success, data, error } = loginSchema.safeParse(req.body);

	if (!success || error) {
		res
			.status(400)
			.json({ success: false, message: error.flatten().fieldErrors });
		return;
	}

	try {
		const admin = await Admin.findOne({ email: data.email });

		if (!admin) {
			res
				.status(401)
				.json({ success: false, message: "Invalid email or password" });
			return;
		}

		// Check password
		const isPasswordCorrect = await bcrypt.compare(
			data.password,
			admin.password
		);

		if (!isPasswordCorrect) {
			res.json({ success: false, message: "Invalid email or password" });
			return;
		}

		const user = {
			id: admin.id,
			email: admin.email,
			username: admin.username,
		};

		// create access token
		const access_token = generate_access_token(user);

		// Set cookie and return response
		res
			.status(200)
			.cookie("_access_token", access_token, access_tokenOptions)
			.json({
				success: true,
				user,
				message: "Login successful",
			});
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// logout
const logoutUser: RequestHandler = (req: Request, res: Response) => {
	res
		.clearCookie("_access_token", {
			httpOnly: true,
			secure: env.isProd,
			sameSite: env.isProd ? "none" : "lax",
			path: "/",
		})
		.status(200)
		.json({ success: true, message: "User Logged Out" });
};

export { loginUser, logoutUser };
