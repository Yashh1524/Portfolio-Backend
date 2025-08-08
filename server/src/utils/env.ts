import { cleanEnv, num, str, url } from "envalid";

const env = cleanEnv(process.env, {
	CLOUDINARY_CLOUD_NAME: str(),
	CLOUDINARY_API_KEY: str(),
	CLOUDINARY_API_SECRET: str(),

	TOKEN_KEY: str(),
	TOKEN_KEY_EXPIRY: str(),

	PORT: num(),
	ADMIN_URL: url(),
	CLIENT_URL: url(),
	MONGO_URI: url(),
	NODE_ENV: str({ choices: ["development", "production"] }),
});

export default env;
