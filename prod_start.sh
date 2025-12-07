#!/bin/sh

echo "Starting production deployment..."

# Replace dev_ with prod_ in deploy-commands.js
echo "Updating deploy-commands.js to use production credentials..."
sed -i 's/dev_token/prod_token/g' deploy-commands.js
sed -i 's/dev_clientId/prod_clientId/g' deploy-commands.js

# Replace dev_ with prod_ in index.js
echo "Updating index.js to use production credentials..."
sed -i 's/dev_token/prod_token/g' index.js

echo "Deploying slash commands to Discord..."
node deploy-commands.js

sleep 5

echo "Starting the bot..."
node index
