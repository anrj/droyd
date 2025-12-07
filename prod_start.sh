#!/bin/sh

echo "Starting production deployment..."

echo "Updating deploy-commands.js to use production credentials..."
sed -i 's/\.setToken(dev_token)/.setToken(prod_token)/' deploy-commands.js
sed -i 's/applicationCommands(dev_clientId)/applicationCommands(prod_clientId)/' deploy-commands.js

echo "Updating index.js to use production credentials..."
sed -i 's/\.login(dev_token)/.login(prod_token)/' index.js

echo "Deploying slash commands to Discord..."
node deploy-commands.js

sleep 3

echo "Starting the bot..."
node index
