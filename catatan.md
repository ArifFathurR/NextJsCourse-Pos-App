# Penjelasan Arsitektur Supabase di Next.js App Router (`src/lib/supabase`)

Dokumen ini berisi panduan lengkap mengenai cara kerja file-file Supabase pada folder `src/lib/supabase/`, pembagian hak akses (Client vs Server), serta alasan dan mekanisme kerja `middleware.ts`.

---

## 1. Mengapa Ada Tiga Client Berbeda?

Dalam aplikasi Next.js (App Router), kode dieksekusi di beberapa lingkungan yang berbeda:
1. **Browser (Client Component)**: Menggunakan JavaScript di sisi browser pengguna.
2. **Server (Server Component, Server Actions, Route Handler)**: Berjalan di Node.js server.
3. **Edge / Middleware**: Berjalan di antara request pengguna dan server Next.js sebelum halaman selesai diproses.

Supabase menyediakan paket `@supabase/ssr` untuk mengelola otentikasi berbasis **Cookie** secara aman di seluruh lingkungan tersebut.

---

## 2. Bedah Kode File per File

### A. `src/lib/supabase/client.ts` (Browser Client)

```typescript
import { environment } from '@/configs/environment';
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    const { SUPABASE_ANON_KEY, SUPABASE_URL } = environment; 
    return createBrowserClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
}
```

#### Penjelasan:
- **Tujuan**: Digunakan khusus di **Client Component** (komponen dengan direktif `"use client"`).
- **Cara Kerja**:
  - Menggunakan `createBrowserClient` dari `@supabase/ssr`.
  - Mengambil cookie browser secara langsung via `document.cookie`.
  - Menggunakan `NEXT_PUBLIC_ANON_KEY` (kunci publik yang aman diekspos ke publik).
- **Kapan Digunakan**:
  - Operasi interaktif di browser, seperti subscribe ke Realtime channel Supabase, event listener login di tombol client, dll.

---

### B. `src/lib/supabase/server.ts` (Server Component & Server Actions)

```typescript
import { environment } from "@/configs/environment";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CreatClientOptions = {
  isAdmin?: boolean;
};

export async function createClient({ isAdmin = false }: CreatClientOptions) {
  const cookieStore = await cookies();
  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = environment;

  return createServerClient(
    SUPABASE_URL!,
    isAdmin ? SUPABASE_SERVICE_ROLE_KEY! : SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            console.error("Error setting cookies", cookiesToSet);
          }
        },
      },
    },
  );
}
```

#### Penjelasan:
- **Tujuan**: Digunakan di **Server Components**, **Server Actions**, dan **Route Handlers** (`api/`).
- **Cara Kerja**:
  - Mengakses `cookies()` dari `next/headers`.
  - `getAll()` membaca cookie sesi auth pengguna yang dikirimkan oleh browser pada header request.
  - `setAll()` menulis/memperbarui cookie (hanya bisa berjalan di Server Actions atau Route Handlers; Server Component read-only sehingga dibungkus dalam blok `try...catch` agar tidak crash).
- **Fitur Khusus (`isAdmin`)**:
  - Jika `isAdmin: true`, client menggunakan `SUPABASE_SERVICE_ROLE_KEY`. Kunci ini memiliki hak akses admin penuh dan **mengabaikan RLS (Row Level Security)**.
  - ⚠️ **PENTING**: Jangan pernah menggunakan `isAdmin: true` di browser/client! Kunci ini hanya boleh berada di backend yang aman.

---

### C. `src/lib/supabase/middleware.ts` (Session Updater & Guard)

```typescript
import { environment } from "@/configs/environment";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = environment;

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  // Route Guarding (Proteksi Halaman):
  if (!user && request.nextUrl.pathname !== '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && request.nextUrl.pathname !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

---

## 3. Kenapa Middleware-nya Bekerja? Bagaimana Mekanismenya?

### Alur Kerja (Workflow)
Di root folder terdapat file `src/middleware.ts`:
```typescript
import { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|fivicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
```

Next.js secara otomatis menjalankan fungsi `middleware` ini **pada setiap request masuk**, sebelum halaman dirender.

### 2 Tugas Utama Middleware Supabase:

#### 1. Sinkronisasi & Refresh Token Otomatis (Session Refresh)
- Token akses (Access Token) Supabase memiliki masa kedaluwarsa (biasanya 1 jam).
- Saat user membuka halaman, `middleware` memanggil:
  ```typescript
  await supabase.auth.getUser();
  ```
- Jika access token sudah kedaluwarsa, Supabase akan menggunakan refresh token untuk memperbaruinya.
- Callback `setAll()` menangani penulisan cookie baru tersebut ke:
  1. `request.cookies` (agar Server Component yang akan dirender langsung membaca token baru).
  2. `supabaseResponse.cookies` (agar browser menerima cookie baru di response header `Set-Cookie`).

> 💡 **Kenapa wajib di middleware?**
> Server Component Next.js bersifat **read-only** (tidak bisa mengubah cookie respon). Jika token kedaluwarsa saat membuka Server Component, hanya Middleware yang memiliki wewenang menyisipkan cookie baru sebelum halaman dirender.

#### 2. Route Guarding (Otorisasi & Proteksi URL)
Middleware memeriksa apakah user sedang login atau tidak:
- **Jika belum login (`!user`)**:
  - Dilarang mengakses halaman tertutup (seperti dashboard).
  - Otomatis di-redirect ke `/login`.
- **Jika sudah login (`user`)**:
  - Jika mencoba mengakses halaman login kembali, otomatis diarahkan ke halaman utama (`/`).

#### 3. Matcher Regex
Baris `matcher` di `src/middleware.ts` memastikan middleware **hanya berjalan untuk halaman aplikasi** dan **tidak membuang resource** pada aset statis (gambar `.png`, `.svg`, file cache `_next/static`, font, dll.).

---

## Ringkasan Perbedaan Ketiganya

| Fitur / Karakteristik | `client.ts` | `server.ts` | `middleware.ts` |
| :--- | :--- | :--- | :--- |
| **Lingkungan Eksekusi** | Browser (Client Component) | Node.js Server (RSC, Actions, Route Handler) | Next.js Edge / Middleware |
| **Media Cookie** | `document.cookie` | `next/headers` -> `cookies()` | `NextRequest` & `NextResponse` |
| **Wewenang Mengubah Cookie** | Ya (via browser API) | Hanya di Server Action / Route Handler | Ya (bisa memodifikasi response header) |
| **Kemampuan Refresh Token** | Otomatis di background browser | Tidak bisa refresh jika di RSC | **Wajib & bertugas utama merefresh token** |
| **Akses Admin (`service_role`)** | ❌ Sangat Dilarang |  Bisa jika diperlukan (`isAdmin: true`) | ❌ Tidak Direkomendasikan |
