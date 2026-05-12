export class Validator {
    static checkEmpty = (data: object) => {
        for (const [key, value] of Object.entries(data)){
            if (value === null || value === undefined || value === "") {
                console.log('hi')
                return `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
              }
        }

        return null
    }
}
