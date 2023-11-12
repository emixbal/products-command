import bcrypt from 'bcrypt';

class PasswordHash {
    public static hash = async (password: string): Promise<string> => {
        return await bcrypt.hash(password, 10)
    }
    
    public static compare = async (password: string, passwordHashed: string): Promise<boolean> => {
        return await bcrypt.compare(password, passwordHashed )
    }
}

export default PasswordHash