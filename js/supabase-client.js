// =========================================================
// KYVENZA ADMIN — Configuração do Supabase
// =========================================================
// Use os MESMOS valores do app/js/supabase-client.js (mesmo projeto Supabase).
const SUPABASE_URL = "https://bkjphntswqbcsrhismig.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Qaug0jOTe5ExSa5GlgvalA_Lng42Ggb";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Exige sessão ativa E que o usuário esteja na tabela `admins`.
 * Se qualquer uma das duas condições falhar, redireciona pro login do admin.
 */
async function exigirAdmin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = "index.html";
    return null;
  }

  const { data: admin, error } = await supabase
    .from("admins")
    .select("id, email")
    .eq("auth_user_id", session.user.id)
    .maybeSingle();

  if (error || !admin) {
    alert("Este login não tem acesso ao painel administrativo.");
    await supabase.auth.signOut();
    window.location.href = "index.html";
    return null;
  }

  return admin;
}

async function sairAdmin() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}
