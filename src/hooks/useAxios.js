import React, { useEffect, useState } from "react";
import axios from "axios";

// export function useAxios() {
//     const [resp, setResp] = useState(null);
//     const [err, setErr] = useState("");
//     const [loading, setLoading] = useState(true);

//     async function featchData(axiosParams) {
//         try {
//             const result = await axios.request(axiosParams);
//             setResp(await result);
//         } catch (error) {
//             setErr(error);
//         } finally {
//             setLoading(false);
//         }
//         return { resp, err, loading };
//     }

//     return { featchData };
// }
export const useAxios = (initialData) => {
    const [data, setData] = useState(initialData);
    const [url, setUrl] = useState(initialUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);

        try {
            const result = await axios(url);

            setData(result.data);
        } catch (error) {
            setIsError(true);
        }

        setIsLoading(false);
    };

    return [{ data, isLoading, isError }, fetchData];
};

export function useEffectAxios(axiosParams) {
    const [resp, setResp] = useState(undefined);
    const [err, setErr] = useState("");
    const [loading, setloading] = useState(true);

    const featchData = async (params) => {
        try {
            const result = await axios.request(params);
            setResp(result);
        } catch (error) {
            setErr(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData(axiosParams);
    }, []);
    return { response, error, loading };
}
