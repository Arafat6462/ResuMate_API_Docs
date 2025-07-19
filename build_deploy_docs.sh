#!/bin/bash
# deploy-docs.sh

echo "Building documentation..."
docker compose exec mkdocs mkdocs build

echo "Uploading to server..."
rsync -avz --delete site/ ssh root@159.223.68.35:/var/www/docs/

echo "Setting permissions..."
ssh root@159.223.68.35 "sudo chown -R www-data:www-data /var/www/docs && sudo chmod -R 755 /var/www/docs"

echo "Documentation deployed successfully!"