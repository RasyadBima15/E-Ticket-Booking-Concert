import publicClient from "../clients/public.client";
import privateClient from "../clients/private.client";

const ticketEndPoint = {
    createTicket: '/ticket',
    getAllConcerts: '/ticket',
    getTicketByConcert: ({concertId}) => `/ticket/concert/${concertId},`
}

const ticketApi = {
    // createTicket: async () => {
    //     try {
    //         const response = await privateClient.post(ticketEndPoint.createTicket, {
                
    //         })
    //         return { response }
    //     } catch (error) {
    //         return { error }
    //     }
    // },
}