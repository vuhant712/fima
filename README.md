# FiMa

## Chạy backend
```
cd backend
cp .env.example .env      # điền DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID, FACEBOOK_APP_ID/SECRET
npm install
npx prisma db push        # tạo bảng trong PostgreSQL
npm run dev               # http://localhost:5000
```

## Chạy frontend
```
cd frontend
cp .env.example .env      # điền VITE_GOOGLE_CLIENT_ID, VITE_FACEBOOK_APP_ID
npm install
npm run dev               # http://localhost:5173
```
