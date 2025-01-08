cp  index.prod.html index.html
pnpm i && pnpm run build

# put dev index.html back
cp index.dev.html index.html