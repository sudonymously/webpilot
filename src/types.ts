type Role = 'assistant' | 'user' | 'system';

export interface Message {
    role: Role;
    content: string;
}
