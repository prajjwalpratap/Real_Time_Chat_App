import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
		const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
		if (!success) {
			console.log("sccess false");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("http://localhost:5000/api/auth/signup", {
				method: "POST",
				mode:"no-cors",
				headers: { "Content-Type": "application/json" ,
					"Accept":"application/json"
				},
				body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
			});

			const data = await res?.json();
			console.log(data,res);
			if (data.error || res)  {
               console.log(" error in data",data.error,res);
				throw new Error(data.error);
				
			}
			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			toast.error(error.message);
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};
export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
	if (!fullName || !username || !password || !confirmPassword || !gender) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}
