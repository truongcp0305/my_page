tinygo build -o public/main.wasm -target wasm ./wasm/main.go
cp $(tinygo env TINYGOROOT)/targets/wasm_exec.js public/

cd frontend
npm install
npm run build
cp dist/assets/* ../public/