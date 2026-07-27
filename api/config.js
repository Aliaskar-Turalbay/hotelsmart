// Vercel Serverless Function: GET /api/config
// Отдаёт admin.html публичные настройки подключения к Supabase.
//
// SUPABASE_ANON_KEY — это НЕ секрет: анонимный ключ специально предназначен
// для использования в браузере, безопасность обеспечивает Row Level Security
// (см. supabase-schema.sql — anon без входа в систему не может ничего читать).
//
// Требует переменных окружения:
//   SUPABASE_URL
//   SUPABASE_ANON_KEY  (Settings → API → anon public, НЕ service_role!)

export default function handler(req, res) {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return res.status(500).json({ error: 'Сервер не настроен: нет SUPABASE_URL / SUPABASE_ANON_KEY' });
  }

  res.status(200).json({ url, anonKey });
}
