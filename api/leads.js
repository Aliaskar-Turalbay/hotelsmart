// Vercel Serverless Function: POST /api/leads
// Принимает данные формы с сайта и сохраняет их в таблицу `leads` в Supabase.
//
// Требует двух переменных окружения (задаются в Vercel, НЕ в коде):
//   SUPABASE_URL              — URL вашего проекта, напр. https://xxxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY — service_role ключ (Settings → API в Supabase)
// См. README.md — там пошагово, как создать таблицу и получить эти значения.
//
// Важно: используется service_role ключ, потому что он не публикуется в браузере —
// вызов идёт только с сервера. Никогда не кладите service_role ключ в код фронтенда.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const { name, hotel, city, whatsapp } = req.body || {};

  if (!name || !hotel || !city || !whatsapp) {
    return res.status(400).json({ error: 'Заполните все поля формы' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('Отсутствуют переменные окружения SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
    return res.status(500).json({ error: 'Сервер не настроен — свяжитесь с администратором' });
  }

  const clean = (s) => String(s).slice(0, 300);

  try {
    const resp = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify([
        {
          name: clean(name),
          hotel: clean(hotel),
          city: clean(city),
          whatsapp: clean(whatsapp),
        },
      ]),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Supabase insert error:', resp.status, errText);
      return res.status(502).json({ error: 'Не удалось сохранить заявку в Supabase' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Ошибка при обращении к Supabase:', err);
    return res.status(500).json({ error: 'Не удалось связаться с Supabase' });
  }
}
