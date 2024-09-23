import UserModel from "../models/authUserModel.js";
import { generateToken } from "../utils/getTokenJWT.js";
import { oAuth2Client } from "../utils/googleConfig.js";
import axios from "axios";

export const googleLogin = async (req, res) => {
	
	try {
		const { code } = req.query;
		
        if (!code) {
            return res.status(400).send("No authorization code provided");
        }
		const googleResponse = await oAuth2Client.getToken(code)
		oAuth2Client.setCredentials(googleResponse.tokens);
		console.log(googleResponse);

		const userResponse = await axios.get(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`
		);

		//console.log(userResponse.data);
		const { email, name, picture } = userResponse.data;
		
		let user = await UserModel.findOne({email});
		
        if (!user) {
            user = new UserModel({ email, name, picture });
            await user.save();
        }

		const { _id } = user
		const token = generateToken( {_id, email} );

		return res.status(200).json({
			message: "Login successful",
            token,
            user
		})
        
	} catch (error) {
		console.log('Error al iniciar sesion con Google: ', error)
		res.status(500).send("Hubo un error al iniciar sesion con Google");
	}
};

export const getAuthSuccess = (req, res) => {
	res.json({ message: "Login successful", token: req.query.token });
};