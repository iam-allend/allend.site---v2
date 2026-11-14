// Bit's vocabulary. Cheerful by default, short fuse when poked too much.
import type { I18n } from '@/lib/i18n';

export const LINES: Record<string, I18n[]> = {
  hello: [
    { id: 'Halo! Aku Bit.', en: "Hi! I'm Bit." },
    { id: 'Selamat datang, santai saja.', en: 'Welcome, make yourself at home.' },
    { id: 'Eh, ada tamu!', en: 'Oh, a visitor!' },
  ],
  backAgain: [
    { id: 'Tunggu aku!', en: 'Wait for me!' },
    { id: 'Jangan tinggalkan aku!', en: "Don't leave me behind!" },
    { id: 'Hup! Sampai.', en: 'Hup! Made it.' },
  ],
  thoughts: [
    { id: 'Hmm, padding ini kurang 2px.', en: 'Hmm, this padding is 2px short.' },
    { id: 'Sudah lihat proyek HRIS-nya?', en: 'Seen the HRIS project yet?' },
    { id: 'Query-nya sudah pakai index, aman.', en: 'That query uses an index. Nice.' },
    { id: 'Kopi dulu, baru deploy.', en: 'Coffee first, then deploy.' },
    { id: 'Siapa yang naruh console.log di sini?', en: 'Who left a console.log here?' },
    { id: 'Aku bisa diangkat, lho.', en: 'You can pick me up, you know.' },
  ],
  poke: [
    { id: 'Hehe, geli!', en: 'Hehe, that tickles!' },
    { id: 'Halo juga!', en: 'Hello to you too!' },
    { id: 'Hop!', en: 'Hop!' },
  ],
  annoyed: [
    { id: 'Hei, sudah ya.', en: 'Hey, that is enough.' },
    { id: 'Aku lagi kerja, lho.', en: "I'm working here." },
  ],
  angry: [
    { id: 'CUKUP! Aku marah!', en: "THAT'S IT! I'm mad!" },
    { id: 'Berhenti menekan aku!!', en: 'Stop poking me!!' },
    { id: 'Grrr… 404 kesabaran tidak ditemukan.', en: 'Grrr… 404 patience not found.' },
  ],
  forgive: [
    { id: 'Ya sudah, aku maafkan.', en: 'Fine. You are forgiven.' },
    { id: 'Oke, aku sudah tenang.', en: 'Okay, I have calmed down.' },
  ],
  held: [
    { id: 'Hei! Turunkan aku!', en: 'Hey! Put me down!' },
    { id: 'Waaa, tinggi!', en: 'Whoa, high up!' },
  ],
  landed: [
    { id: 'Aduh… lantainya retak.', en: 'Ouch… cracked the floor.' },
    { id: 'Mendarat sempurna! Kurang lebih.', en: 'Perfect landing! More or less.' },
    { id: 'Pusing…', en: 'So dizzy…' },
  ],
  scrolled: [
    { id: 'Pelan-pelan scroll-nya!', en: 'Easy on the scroll!' },
    { id: 'Whoaaa!', en: 'Whoaaa!' },
  ],
  wake: [
    { id: 'Eh! Aku tidak tidur kok.', en: "Huh! I wasn't sleeping." },
    { id: 'Lima menit lagi…', en: 'Five more minutes…' },
  ],
  dark: [{ id: 'Siapa yang matikan lampu?!', en: 'Who turned off the lights?!' }],
  light: [{ id: 'Aduh, silau!', en: 'Argh, too bright!' }],
  langEn: [{ id: 'Oh, sekarang bahasa Inggris?', en: 'English now? Cool.' }],
  langId: [{ id: 'Balik ke bahasa Indonesia, sip.', en: 'Back to Indonesian, nice.' }],
  bye: [{ id: 'Oke, aku istirahat dulu.', en: 'Okay, taking a break.' }],
};
