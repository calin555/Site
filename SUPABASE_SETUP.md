# Configurare Supabase pentru ChargePro

Ghid pas cu pas pentru baza de date persistentă (produse, utilizatori, comenzi).

## 1. Creează proiectul Supabase

1. Mergi la [https://supabase.com](https://supabase.com) și creează un cont
2. **New project** → alege nume (ex: `chargepro`), parolă DB (salveaz-o!)
3. Așteaptă ~2 minute până e gata proiectul

## 2. Copiază cheile API

În Supabase: **Project Settings → API**

| Variabilă | Unde o găsești |
|-----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (secret — doar server) |

Exemplu `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL="https://dynnchhopbrpafhjsxhn.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
SESSION_SECRET=un-string-secret-lung-minim-32-caractere
```

> **Parola admin site** = `Admin1234` (email `admin@chargepro.ro`) — se creează la `npm run db:seed`.

## 3. Aplică schema SQL

Migrările SQL sunt în `supabase/migrations/`. Rulează-le în ordine în **Supabase → SQL Editor**:

1. `20250615000000_init/migration.sql`
2. `20250622000000_market_comparison/migration.sql`
3. `20250622120000_market_romania_only/migration.sql`
4. `20250622140000_source_url_verify/migration.sql`
5. `20250623100000_site_contact_settings/migration.sql`

Sau folosește [Supabase CLI](https://supabase.com/docs/guides/cli) dacă îl ai configurat.

## 4. Populează datele inițiale

```powershell
cd "D:\Site statii incarcare"

npm run db:seed
```

Opțional — date piață comparație:

```powershell
npm run db:seed:market
```

## 5. Repornește site-ul

```powershell
npm run dev
```

## 6. Verifică

| Ce verifici | Unde |
|-------------|------|
| Tabele create | Supabase → **Table Editor** |
| Cont admin | `/autentificare` → `admin@chargepro.ro` / `Admin1234` |
| Produse goale | `/admin/produse` → 0 produse |
| Adaugă produs | `/admin/produse` → **Produs nou** |

## Conturi create de seed

| Email | Parolă | Rol |
|-------|--------|-----|
| `demo@chargepro.ro` | `Demo1234` | Client |
| `admin@chargepro.ro` | `Admin1234` | Admin |
| `super@chargepro.ro` | `Super1234` | Super Admin |

## Ce se salvează în Supabase

| Date | Status |
|------|--------|
| **Produse** | ✅ Persistent — adăugare/editare/ștergere din admin |
| **Utilizatori** | ✅ La login + înregistrare |
| **Categorii & branduri** | ✅ Din seed |
| Comenzi | ✅ Persistent (sync cu memorie) |
| Blog | În memorie (momentan) |

## Fără Supabase (mod demo)

Dacă **nu** setezi `NEXT_PUBLIC_SUPABASE_URL` și `SUPABASE_SERVICE_ROLE_KEY`, site-ul funcționează cu date în memorie (produsele demo revin la restart).

## Depanare

**`Supabase nu este configurat`**
- Verifică `NEXT_PUBLIC_SUPABASE_URL` și `SUPABASE_SERVICE_ROLE_KEY` în `.env`
- Asigură-te că proiectul Supabase e activ (nu paused)

**Produsele nu apar după adăugare**
- Repornește `npm run dev`
- Verifică în Supabase Table Editor → `products`

**Eroare la query Supabase**
- Verifică că migrările SQL au fost aplicate
- Verifică RLS: aplicația folosește `service_role` care ocolește RLS
