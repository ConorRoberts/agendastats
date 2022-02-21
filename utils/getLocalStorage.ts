/**
 * Grabs property from local storage;
 * @param name 
 * @returns 
 */
const getLocalStorage = (name: string): any => {
  try {
    if (window === undefined) throw new Error();

    const data = localStorage.getItem(name);

    if (!data) return null;

    return JSON.parse(data);
  } catch (e) {
    console.error("Error getting from local storage");

    return null;
  }
};

export default getLocalStorage;