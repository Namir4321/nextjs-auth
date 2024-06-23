import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import db from "./db";
import { cookies } from "next/headers";

const adapter=new BetterSqlite3Adapter(db,{
    user:'users',
    session:"sessions"
});

const lucia=new Lucia(adapter,{
    sessionCookie:{
        expires:false,
        attributes:{
            secure:process.env.NODE_ENV === 'production'
        }
    }
})
export async function createAuthSession(userId) {
const session=await lucia.createSession(userId,{})
const sessionCookie=lucia.createBlankSessionCookie(session.id);
cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
)
}
export const verifyAuth=async()=>{
    const sessionCookie=cookies().get(lucia.sessionCookieName);
    if(!sessionCookie){
        return{
            user:null,
            session:null,
        }
    }
    const sessionId=sessionCookie.value;
    if(!sessionId){
        return {
            user:null,
            session:null,
        }
    }
    const result=await lucia.validateSession(sessionId);
    try{
        if(result.session && result.session.fresh){
            const sessionCookie=lucia.createSessionCookie(result.session.id);
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
        }
        if(!result.session){
            const sessionCookie=lucia.createBlankSessionCookie();
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            )
        }
    } catch{}
    return result
}
export const auth = async (mode, prevState, formData) => {
  if (mode === "login") {
    return login(prevState, formData);
  }
  return authAction(prevState, formData);
};
export const destorySession = async () => {
  const { session } = await verifyAuth();
  if (!session) {
    return {
      error: "Unauthorized!",
    };
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};