FROM denoland/deno:2.2.2

WORKDIR /app

USER deno

COPY deno.json .
COPY deno.lock .

RUN deno install

COPY . .

EXPOSE ${PORT}
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "src/main.ts"]
