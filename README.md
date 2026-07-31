# Fidelo

La carte de fidelite papier de votre commerce, transformee en carte digitale : tampons, recompenses et suivi client sans rien imprimer.

## Stack

- **Frontend** : Nuxt 3, Vue 3, Tailwind CSS, Pinia
- **Backend** : NestJS, TypeORM, PostgreSQL, Passport/JWT
- **Infra** : Docker / docker-compose

## Fonctionnalites (MVP)

- Comptes commercants (inscription / connexion par JWT)
- Creation de programmes de fidelite : nombre de tampons requis + recompense
- Inscription de clients avec generation d'un code unique par client
- Ajout de tampon en un clic depuis l'espace commercant (recherche par code)
- Detection automatique de la recompense (reset des tampons + recompense disponible)
- Utilisation de la recompense (decompte)
- Carte publique par client (`/card/:code`) avec QR code, consultable sans compte
- Tableau de bord commercant avec liste des programmes et des clients

## Demarrer en local

### Avec Docker (recommande)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up --build
```

- Frontend : http://localhost:3020
- API : http://localhost:3021/api

### Sans Docker

**Backend**

```bash
cd backend
cp .env.example .env   # renseigner DATABASE_URL vers un Postgres local
npm install
npm run start:dev
```

**Frontend**

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Structure

```
fidelo/
  backend/    # API NestJS (auth, programs, members)
  frontend/   # App Nuxt 3 (landing, dashboard, carte publique)
  docker-compose.yml
```

## Roadmap possible

- Scan de QR code natif depuis l'espace commercant (camera) plutot que la recherche par code
- Notifications SMS/email quand une recompense est debloquee
- Statistiques de frequentation par programme
- Multi-utilisateurs par commerce (equipe)
