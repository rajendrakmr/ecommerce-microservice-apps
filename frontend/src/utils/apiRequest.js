import axios from "./axios";

export const apiRequest = async ({
    url,
    method = "GET",
    data,
    params,
}) => {

    try {

        const response = await axios({
            url,
            method,
            data,
            params
        });

        return response.data;

    } catch (error) {  
        if (error.response) {
            throw {
                status: error.response.status,
                data: error.response.data
            };
        } 
        throw {
            status: 500,
            data: { message: "Network error" }
        };

    }

};