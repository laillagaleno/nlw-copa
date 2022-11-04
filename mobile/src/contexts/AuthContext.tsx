//criando contexto para verificar as autenticações 

import { createContext, ReactNode, useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from  "expo-auth-session/providers/google"
import * as AuthSession from  "expo-auth-session"

 
WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
}

interface AuthProviderProps{
    children: ReactNode;
}


export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps){

    const [user, setUser] = useState<UserProps>({}as UserProps);

    const [isUserLoading, setIsUserLoading] = useState(false);

    const [ request, response, promptAsync ] = Google.useAuthRequest({
        clientId:"1018735406112-ldnhl79tt3mcv3u9p1rsq79ibtejimo8.apps.googleusercontent.com",
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ["profile","email"],
    })

    async function signIn() {
        try{
            setIsUserLoading(true);
            await promptAsync()
        }catch(err){
            console.log(err);
            throw err;
        }finally{
            setIsUserLoading(false);
        }
    }

    async function signInWhitGoogle(acess_token: string){
        console.log("TOKEN DE AUTENTICAÇÃO ===> ", acess_token);
    }

    useEffect(() => {
        if(response?.type === "success" && response.authentication?.accessToken){
            signInWhitGoogle(response.authentication.accessToken);
        }
    }, [response]);

    return(
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user,
        }}>
            {children}
        </AuthContext.Provider>
    )
}