# Villa-Sera

Sitio web oficial de **Villa Sera** (Los Cabos). Código en `villa-serana/` (Next.js 16, i18n, Tailwind).

## Desarrollo local

Desde la **raíz del repo** (recomendado — monorepo npm):

```bash
npm install
npm run dev
```

O solo la app:

```bash
cd villa-serana
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — redirige a `/es`.

## Vercel (deploy)

El repo tiene `package.json` en la **raíz** con **npm workspaces** y `vercel.json` para que el build sea `npm install` + `npm run build` sin configurar subcarpeta.

1. Importa el repo **Villa-Sera** en Vercel.
2. **Root Directory:** déjalo en **`.`** (raíz) o vacío — ya no hace falta poner `villa-serana` si usas este `package.json` raíz.
3. Framework: detecta **Next.js** tras `npm install`; si no, elige **Next.js** manualmente.
4. Guarda y **Redeploy**.

Si ves **404 NOT_FOUND**, suele ser un deploy anterior con **Root Directory** mal puesto: vuelve a desplegar tras el último commit.

Las fotos del sitio viven en `villa-serana/public/images/`. Las copias sueltas en la raíz del proyecto no se versionan (ver `.gitignore`).
