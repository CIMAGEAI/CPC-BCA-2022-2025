import React, { createContext, useState } from "react";

export interface User {
  name: string;
  phoneNumber: string;
  emailId:string,
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upa: string;
  balance: number;
}


interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  balance: number;
  setBalance: (balance: number) => void;
  jwt: string | null;
  setJwt: (jwt: string | null) => void;
  sessionId: string | null;
  setSessionId: (sessionId: string | null) => void;
}


export const UserContext = createContext<UserContextType | undefined>(undefined);


export function UserProvider({ children }:any){
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [jwt, setJwt] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string|null>(null);

  return (
    <UserContext.Provider value={{ user, setUser, balance, setBalance, jwt, setJwt, sessionId, setSessionId }}>
      {children}
    </UserContext.Provider>
  );
}