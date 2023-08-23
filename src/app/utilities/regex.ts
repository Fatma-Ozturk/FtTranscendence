export class RegexService {
    public static isValidEmail(email: string): boolean {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }
    public static isAlphabetic(input: string): boolean {
        const alphabeticPattern = /^[a-zA-Z]+$/;

        return alphabeticPattern.test(input);
    }
    public static hasSingleSpaceAndAlphabetic(input: string): boolean {
        const pattern = /^[a-zA-Z]+ [a-zA-Z]+$/;

        return pattern.test(input);
    }
    public static isPhoneNumber(input: string): boolean {
        const phonePattern = /^\d{10}$/;

        return phonePattern.test(input);
    }
    public static isNumeric(input: string): boolean {
        const numericPattern = /^\d+$/;

        return numericPattern.test(input);
    }

}