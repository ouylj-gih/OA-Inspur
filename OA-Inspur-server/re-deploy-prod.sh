docker build -t wechat-shopping-mall-server:prod . &&
# docker build -t wechat-shopping-mall-server-cron:prod -f Dockerfile.cron . &&
docker service update  --container-label-add last_deployed=$(date -u +%Y-%m-%dT%H:%M:%S)  wechat-shopping-mall-server_prod_server
# docker service update  --container-label-add last_deployed=$(date -u +%Y-%m-%dT%H:%M:%S)  wechat-shopping-mall-server_prod_cron
