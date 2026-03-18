# Backend local run

## 1) Create database
Install MongoDB locally or run MongoDB in Docker.

Recommended local database URL already set in `.env`:

```env
DATABASE_URL=mongodb://127.0.0.1:27017/abdullah-fatima
```

## 2) Install packages
```bash
npm install
```

## 3) Start backend
```bash
npm run start:dev
```

Backend will run on:
```text
http://localhost:7001/api
```

## 4) Important notes
- Login API URL is `http://localhost:7001/api/auth/login`
- Do not use `https://local:7001`
- Use `http://localhost:7001`
- Replace Cloudinary and email values in `.env` before using uploads or emails
