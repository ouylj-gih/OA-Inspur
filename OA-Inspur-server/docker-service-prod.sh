docker network create --driver overlay --subnet 10.125.93.0/24 wechat-shopping-mall-server-prod-network
docker service create --name wechat-shopping-mall-server_prod_postgres --network wechat-shopping-mall-server-prod-network --env POSTGRES_PASSWORD=WLRZrdKQxKC5RQrdKnQ6H5Id6PVHUZmi --mount src=pgdata-wechat-shopping-mall-server-prod,dst=/var/lib/postgresql/data postgres:9.5
docker service create --name wechat-shopping-mall-server_prod_redis-3_2 --network wechat-shopping-mall-server-prod-network redis:3.2
docker service create --name wechat-shopping-mall-server_prod_server --network wechat-shopping-mall-server-prod-network -p 6030:3000 --env NODE_ENV=production --mount src=storage-container,dst=/usr/src/app/server/storage/container1 wechat-shopping-mall-server:prod
