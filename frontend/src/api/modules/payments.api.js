import privateClient from "../clients/private.client";

const paymentEndPoint = {
    createPayment: '/payment',
    getAllPayments: '/payment',
}

const paymentApi = {
    createPayment: async (data) => {
        try {
            const response = await privateClient.post(paymentEndPoint.createPayment, data)
            return { response }
        } catch (error) {
            return { error }
        }
    },
    getAllPayments: async () => {
        try {
            const response = await privateClient.get(paymentEndPoint.getAllPayments);
            return { response };
        } catch (error) {
            return {error}
        }
    },
}

export default paymentApi;