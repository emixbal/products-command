import jwt from "jsonwebtoken";

class JWTToken {
    private static secret: string = process.env.JWT_SECRET || "rahasasiasekalimasee";

    public static generateToken = async (object: {}): Promise<string> => {
        return jwt.sign(object, this.secret);
    }

    public static verifyToken = async (token: string): Promise<[boolean, {}]> => {
        let user: {}
        try {
            user = jwt.verify(token, this.secret);
            return [true, user]
        } catch (error) {
            return [false, {}]
        }

    }
}

export default JWTToken;