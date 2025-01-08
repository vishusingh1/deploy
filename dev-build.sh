# Build without type checking for faster build times
cp  index.prod.html index.html
pnpm i && pnpm run dev-build

# put dev index.html back
cp index.dev.html index.html