echo "Pulling latest version..."
cd ~/Desktop/pkoin.net
git pull

echo "Building project... Please wait..."
npm i
npm run build

echo "Copying files..."
cp -r ./dist/* C:/inetpub/wwwroot/.

echo "pkoin.net website updated !"

$SHELL