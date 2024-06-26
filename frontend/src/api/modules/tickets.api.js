import privateClient from "../clients/private.client";

const ticketEndPoint = {
    createTicket: '/ticket',
    getAllTickets: '/ticket',
    getTicketByConcert: ({concertId}) => `/ticket/concert/${concertId}`,
    getTicket: ({ticketId}) => `/ticket/${ticketId}`
}

const ticketApi = {
    createTicket: async (data) => {
        try {
            const response = await privateClient.post(ticketEndPoint.createTicket, data)
            return { response }
        } catch (error) {
            return { error }
        }
    },
    getAllTickets: async () => {
        try {
            const response = await privateClient.get(ticketEndPoint.getAllTickets);
            return { response };
        } catch (error) {
            return {error}
        }
    },
    getTicketsByConcert: async (concertId) => {
        try {
            const response = await privateClient.get(ticketEndPoint.getTicketByConcert({concertId}));
            return { response };
        } catch (error) {
            return {error}
        }
    },
    getTicket: async (ticketId) => {
        try {
            const response = await privateClient.get(ticketEndPoint.getTicket({ticketId}));
            return { response };
        } catch (error) {
            return {error}
        }
    }
}

export default ticketApi;