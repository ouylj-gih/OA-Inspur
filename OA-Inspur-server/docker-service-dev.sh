docker swarm init
docker network create --driver overlay --subnet 10.133.0.0/24 wechat-shopping-mall-server-network
docker service create --name wechat-shopping-mall-server --network wechat-shopping-mall-server-network -p 28060:3000 --mount src=wechat-shopping-mall-storage-container,dst=/usr/src/app/server/storage/container1 wechat-shopping-mall-server:dev
docker service create --name wechat-shopping-mall-server_postgres -p 35432:5432 --network wechat-shopping-mall-server-network --env POSTGRES_PASSWORD=WLRZrdKQxKC5RQrdKnQ6H5Id6PVHUZmi --mount src=pgdata-wechat-shopping-mall-server,dst=/var/lib/postgresql/data postgres:9.5
docker service create --name wechat-shopping-mall-server_redis-3_2 -p 36379:6379 --network wechat-shopping-mall-server-network redis:3.2
# docker service create --name wechat-shopping-mall-server-cron   --network wechat-shopping-mall-server-network wechat-shopping-mall-server-cron:dev
