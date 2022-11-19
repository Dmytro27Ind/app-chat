import AsyncStorage from '@react-native-async-storage/async-storage';

const saveData = async (key, value) => {
    try {
        const json = JSON.stringify(value)
        await AsyncStorage.setItem(key, json)
        console.log("json value in saveData(): " + json)

    } catch (error) {
        console.log(error)
    }
}

const loadData = async (key) => {
    try {
        let json = await AsyncStorage.getItem(key)
        console.log("json value in loadData(): " + json)
        return (json != null)? JSON.parse(json) : null;

    } catch(error) {
        console.log(error)
    }
}

export {saveData, loadData}