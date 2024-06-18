import publicClient from "../clients/public.client";
import privateClient from "../clients/private.client";

const userEndPoint = {
    loginUser: '/login',
    registerUser: '/register',
    updateUser: ({userId}) => `/user/${userId}`,
    getAllUsers: '/users',
}

const userApi = {
    loginUser: async ({Username, Password}) => {
        try {
            const response = await publicClient.post(userEndPoint.loginUser, {
                Username, 
                Password,
            });
            return { response };
        } catch (error) {
            return {error}
        }
    },
    registerUser: async ({Username, Password, Role}) => {
        try {
            const response = await publicClient.post(userEndPoint.registerUser, {
                Username, 
                Password,
                Role,
            });
            return { response };
        } catch (error) {
            return {error}
        }
    },
    updateUser: async ({userId}, {Fullname, Email, NoTelp, Gender}) => {
        try {
            const response = await privateClient.put(userEndPoint.updateUser({ userId }), {
                Fullname, 
                Email,
                NoTelp,
                Gender,
            });
            return { response };
        } catch (error) {
            return {error}
        }
    },
    getAllUsers: async () => {
        try {
            const response = await privateClient.get(userEndPoint.getAllUsers);
            return { response };
        } catch (error) {
            return {error}
        }
    },
}

export default userApi;