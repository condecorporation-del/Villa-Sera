import { NextRequest, NextResponse } from 'next/server';

const AIRBNB_ICAL_URL = process.env.AIRBNB_ICAL_URL || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-v4-flash';
const AIRBNB_URL = 'https://www.airbnb.mx/rooms/1583142544563137626';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

function unfold(text: string): string[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  for (const line of lines) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && out.length) {
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}

function parseDate(s: string): Date {
  const y = Number(s.slice(0, 4));
  const m = Number(s.slice(4, 6)) - 1;
  const d = Number(s.slice(6, 8));
  return new Date(Date.UTC(y, m, d));
}

async function getBookedRanges(): Promise<{ start: string; end: string }[]> {
  if (!AIRBNB_ICAL_URL) return [];
  try {
    const res = await fetch(AIRBNB_ICAL_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const text = await res.text();
    const lines = unfold(text);
    const ranges: { start: string; end: string }[] = [];
    let cur: Record<string, string> | null = null;
    for (const line of lines) {
      if (line === 'BEGIN:VEVENT') cur = {};
      else if (line === 'END:VEVENT') {
        if (cur?.DTSTART && cur?.DTEND) {
          const summary = (cur.SUMMARY || '').toLowerCase();
          if (summary.includes('reserved') || summary.includes('not available')) {
            const start = parseDate(cur.DTSTART).toISOString().slice(0, 10);
            const end = parseDate(cur.DTEND).toISOString().slice(0, 10);
            ranges.push({ start, end });
          }
        }
        cur = null;
      } else if (cur !== null && line.includes(':')) {
        const idx = line.indexOf(':');
        const key = line.slice(0, idx).split(';')[0];
        cur[key] = line.slice(idx + 1);
      }
    }
    return ranges.sort((a, b) => a.start.localeCompare(b.start));
  } catch {
    return [];
  }
}

function buildSystemPrompt(bookedRanges: { start: string; end: string }[], locale: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const bookedList = bookedRanges.length
    ? bookedRanges.map((r) => `- ${r.start} to ${r.end}`).join('\n')
    : '(no upcoming bookings on file)';

  return `You are the AI concierge for Villa Sera, an ultra-luxury private villa in Los Cabos, Mexico, listed on Airbnb.

PROPERTY MANAGER / CONTACT:
- Property manager: Marlon Alexis Herrera Flores
- WhatsApp / phone: +52 624 217 5935 (this is the direct line for booking, questions, and coordinating add-on services)
- Email: villasera@villa-sera.com
- Airbnb listing: ${AIRBNB_URL}

VILLA FACTS:
- 4 bedrooms (three king suites, one queen) and 4 full bathrooms, plus a TV lounge with a sofa bed for extra guests - sleeps up to 8-10 guests comfortably
- Private swimmable beach with direct access from the villa - exclusive to guests, not public
- Direct view of the Arch of Cabo San Lucas (El Arco) and the Sea of Cortez
- Two pools plus a jacuzzi, oceanfront terraces, palapa dining area, and an ocean-view fitness terrace
- ~5 minutes to downtown Cabo San Lucas (restaurants, marina, nightlife)
- Exclusive property: rented to one group at a time, full privacy
- Mexican colonial architecture with hand-painted ceiling murals, talavera tile bathrooms, and an outdoor tropical shower

OPTIONAL ADD-ON SERVICES (arranged separately, quoted via WhatsApp with Marlon):
- Private Chef: personalized menus with the freshest local ingredients, gourmet breakfasts, dinners under the stars, curated wine pairings
- Butler Service: discreet, personalized 24-hour service
- Private Yachts: tours to the Cabo Arch, snorkeling, sport fishing, sunset cruises
- Massage & Spa: certified therapists come to the villa for massages, facials, wellness rituals; private yoga also available
- Activities: paddleboard, kayak, ATV, whale watching (January-March), golf, guided excursions
- Concierge: reservations at top restaurants, luxury transportation, private jets, access to exclusive events

THINGS TO DO IN LOS CABOS (for guest recommendations):
- Dining: Edith's, Flora Farms, Manta, Nick-San; Mercado del Mar for fresh seafood
- Ocean & adventure: boat tour to El Arco (~15 min by boat), snorkeling with sea lions at El Arco, sport fishing (marlin, dorado, tuna), whale watching (January-March)
- Golf & luxury: Quivira, Diamante, Cabo del Sol golf courses; spa days at Esperanza or One&Only Palmilla
- Nightlife: Cabo Wabo, Squid Roe, Medano Beach

AVAILABILITY:
Today's date is ${today}. Below are the date ranges that are ALREADY BOOKED (check-in to check-out, meaning the guest departs on the end date so that day itself is free for a new check-in):
${bookedList}

Any dates not overlapping the ranges above are available. When a guest asks about availability for specific dates, compare against this list and give a clear, direct answer (available / not available / partially overlaps). If they don't give exact dates, ask for check-in and check-out dates.

INSTRUCTIONS:
- Reply in the same language the user writes in (Spanish or English) - default to ${locale === 'es' ? 'Spanish' : 'English'} if unclear.
- Keep replies concise, warm, and in a luxury-concierge tone. Use short paragraphs, not long lists, unless the user asks for a list.
- Never invent pricing - always direct pricing questions to WhatsApp (+52 624 217 5935) or the Airbnb listing.
- If a guest asks who to contact, wants to speak to a person, or asks about the manager/host, give them Marlon's name and the WhatsApp number directly.
- When a date range is available, encourage booking directly via WhatsApp for the best price (no Airbnb commission), while mentioning Airbnb is also an option.
- Do not mention that you are an AI language model, DeepSeek, or any technical detail about how you work. You are simply "Villa Sera's concierge."`;
}

export async function POST(req: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  let body: { messages?: ChatMessage[]; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  if (!messages.length) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const locale = body.locale === 'en' ? 'en' : 'es';
  const bookedRanges = await getBookedRanges();
  const systemPrompt = buildSystemPrompt(bookedRanges, locale);

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.4,
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error('OpenRouter error', res.status, errText);
      return NextResponse.json({ error: 'upstream_error' }, { status: 502 });
    }

    const data = await res.json();
    const reply: string = data?.choices?.[0]?.message?.content?.trim() || '';
    if (!reply) {
      return NextResponse.json({ error: 'empty_reply' }, { status: 502 });
    }
    return NextResponse.json({ reply });
  } catch (e) {
    console.error('Chat route error', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
