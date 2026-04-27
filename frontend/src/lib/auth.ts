import { supabase } from "./supabase";

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';

const validateAdminCredentials = (email: string, pass: string) => {
  if (email === ADMIN_EMAIL && pass !== ADMIN_PASSWORD) {
    throw new Error('Admin password is incorrect');
  }
};

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/dashboard` }
  });
  if (error) throw error;
};

export const signUpWithEmail = async (email: string, pass: string) => {
  validateAdminCredentials(email, pass);

  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
  });
  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email: string, pass: string) => {
  validateAdminCredentials(email, pass);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) {
    const errorMessage = error.message?.toLowerCase() || '';
    if (
      email === ADMIN_EMAIL &&
      pass === ADMIN_PASSWORD &&
      (errorMessage.includes('invalid login credentials') || errorMessage.includes('password'))
    ) {
      const { data: signupData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: pass,
      });
      if (signUpError) throw signUpError;
      return signupData;
    }
    throw error;
  }
  return data;
};