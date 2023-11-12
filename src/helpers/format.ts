
export const respons = (status: number, message: string, data: {} | [] | null): {} => {
    return {
        status,
        message,
        data
    }
}