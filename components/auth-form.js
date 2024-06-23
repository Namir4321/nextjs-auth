"use client";
import { auth, authAction,  } from "@/actions/authAction";
import { getUSerByEmail } from "@/lib/user";
import Link from "next/link";
import { useFormState } from "react-dom";

export default function AuthForm({mode}) {
  const [formState, formAction] = useFormState(auth.bind(null,mode), {});
  return (
    <form id="auth-form" action={formAction}>
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon" />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      {formState.errors && (
        <ul id="form-errors">
          {Object.keys(formState.errors).map((error) => 
            <li key={error}>{formState.errors[error]}</li>
        )}
        </ul>
      )}
      <p>
        <button type="submit">
          {mode === 'login' ? 'Login':'Create Account'}
          
          </button>
      </p>
      <p>
        {mode==='login' && (
          <Link href='/?mode=signup'>Create an account</Link>
        )}
        {mode === "signup" && (

        <Link href="/?mode=login">Login with existing account.</Link>
        )}
      </p>
    </form>
  );
}
export const login =(prevState)=>{
const email=formData.length('email');
const password=formData.get('password')

const existingUser=getUSerByEmail(email);
if(!existingUser){
   return {
     errors: {
       email: "email is already registered for an account",
     },
   };
}
}
