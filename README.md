#### Run app with docker
```bash
docker-compose up
```

---

#### Run app without docker
1. create `.env` file
2. Update content in `.env` file
```
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
```
3. run the following commands:
```bash
yarn
yarn start:dev
```
