import publicClient from "../clients/public.client";
import privateClient from "../clients/private.client";

const concertEndPoint = {
    createConcert: '/concert',
    getConcert: ({concertId}) => `/concert/${concertId}`,
    getAllConcerts: '/concerts',
    updateConcert: ({concertId}) => `/concert/${concertId}`,
    deleteConcert: ({concertId}) => `/concert/${concertId}`,
}

const concertApi = {
    createConcert: async (formData) => {
        try {
            const response = await privateClient.post(concertEndPoint.createConcert, formData);
            return { response };
        } catch (error) {
            return {error};
        }
    },
    getConcert: async (concertId) => {
        try {
            const response = await privateClient.get(concertEndPoint.getConcert({concertId}));
            return { response };
        } catch (error) {
            return {error}
        }
    },
    getAllConcerts: async () => {
        try {
            const response = await privateClient.get(concertEndPoint.getAllConcerts);
            return { response }
        } catch (error) {
            return { error }
        }
    },
    updateConcert: async (formData, concertId) => {
        try {
            const response = privateClient.put(concertEndPoint.updateConcert({concertId}), formData)
            return { response };
        } catch (error) {
            return { error }
        }
    },
    deleteConcert: async (concertId) => {
        try {
            const response = await privateClient.delete(concertEndPoint.deleteConcert({concertId}));
            return { response };
        } catch (error) {
            return {error}
        }
    }
}

export default concertApi;