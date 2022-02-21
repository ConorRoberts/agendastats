/**
 * 
 * @param name Property name within local storage
 * @param value Values to update
 */
const updateLocalStorage = (name: string, value: object): void => {
  try {
    if (window === undefined) return;

    const data = localStorage.getItem(name);

    if (!data) {
      localStorage.setItem(name, JSON.stringify({ ...value }));
    } else {
      localStorage.setItem(name, JSON.stringify({ ...JSON.parse(data), ...value }));
    }

  } catch (e) {
    console.error("Error saving to local storage");
  }
};

export default updateLocalStorage;
