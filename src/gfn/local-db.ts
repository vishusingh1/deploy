export const clear_db = async function (app_id) {
    // Remove local storage inside the iframe with key {app_id}_app_data_datoms
    localStorage.removeItem(`${app_id}_app_data_datoms`);
    return { success: true, data: {} };
}