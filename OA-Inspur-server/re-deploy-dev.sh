docker build -t wechat-shopping-mall-server:dev . &&
# docker build -t wechat-shopping-mall-server-cron:dev -f Dockerfile.cron . &&
docker service update  --container-label-add last_deployed=$(date -u +%Y-%m-%dT%H:%M:%S)  wechat-shopping-mall-server
# docker service update  --container-label-add last_deployed=$(date -u +%Y-%m-%dT%H:%M:%S)  wechat-shopping-mall-server-cron
