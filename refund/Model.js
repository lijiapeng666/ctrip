export const initialState = {
}
export const setState = (state, data) => {
    return {
        ...state,
        ...data
    }
}
