import { TApplicationCreation } from "@/types/types";
import { Validator } from "./validator";

export class BoardValidator extends Validator{
    static createApplication = (data: TApplicationCreation) => {
        const requiredFields: (keyof TApplicationCreation)[] = ["columnId", "company", "role", "order", "priority", "url"];

        for (const field of requiredFields) {
            const value = data[field];

            if (typeof value === "string" && !value.trim()) {
                return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            }

            if (value === null || value === undefined) {
                return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            }
        }

        return null
    }
}
