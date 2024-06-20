import privateClient from "../clients/private.client";
import publicClient from "../clients/public.client";

const bandEndPoint = {
    createBand: '/band',
    getAllBands: '/bands',
    getBand: ({bandId}) => `/band/${bandId}`,
    getBandByConcert: ({concertId}) => `/band/concert/${concertId}`,
    updateBand: ({bandId}) => `/band/${bandId}`,
    deleteBand: ({bandId}) => `/band/${bandId}`,
}

const bandApi = {
    createBand: async (formData) => {
        try {
            const response = await privateClient.post(bandEndPoint.createBand, formData);
            return { response };
        } catch (error) {
            return {error}
        }
    },
    getAllBands: async () => {
        try {
            const response = await privateClient.get(bandEndPoint.getAllBands);
            return { response };
        } catch (error) {
            return {error}
        }
    },
    getBand: async (bandId) => {
        try {
            const response = await privateClient.get(bandEndPoint.getBand({bandId}));
            return { response };
        } catch (error) {
            return {error}
        }
    },
    getBandByConcert: async (concertId) => {
        try {
            const response = await publicClient.get(bandEndPoint.getBandByConcert({concertId}));
            return { response };
        } catch (error) {
            return {error}
        }
    },
    updateBand: async (formData, bandId) => {
        try {
            const response = await privateClient.put(bandEndPoint.updateBand({bandId}), formData);
            return { response };
        } catch (error) {
            return {error}
        }
    },
    deleteBand: async (bandId) => {
        try {
            const response = await privateClient.delete(bandEndPoint.deleteBand({bandId}));
            return { response };
        } catch (error) {
            return {error}
        }
    },
}

export default bandApi;