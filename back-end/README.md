# Backend

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Supabase packages:

```bash
npm install @supabase/supabase-js dotenv
```

Server runs on http://localhost:3001

## Build

```bash
npm run build
npm start
```

## Swagger API Documentation

### Install Swagger

```bash
npm install swagger-autogen swagger-ui-express
npm install --save-dev @types/swagger-ui-express
```

### Generate Swagger Docs

Run this command whenever you update your routes:

```bash
npm run swagger
```

### Then visit

http://localhost:3001/api-docs
