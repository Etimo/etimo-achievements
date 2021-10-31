#!/bin/bash

main() {
  local postgres_id postgres_label

  postgres_label="com.etimo-achievements.postgres"

  while true; do
    postgres_id=$(docker ps -aq --filter label=$postgres_label)
    if [ -n "$postgres_id" ]; then
      echo "Postgres container exists: $postgres_id"
      if docker ps -q --no-trunc | grep "$postgres_id" >/dev/null; then
        echo "Postgres container is started"
        wait_for_postgres_init
      fi
    fi
    start_postgres
  done
}

wait_for_postgres_init() {
  for i in {1..3}; do
    if select_from_postgres; then
      echo "Postgres is running"
      exit 0
    else
      echo "Postgres is not running ($i)"
    fi
    sleep 5
  done
  echo "Cannot start Postgres"
  exit 1
}

select_from_postgres() {
  docker-compose exec -e PGPASSWORD=root postgres psql -U root -c "SELECT 1;" &>/dev/null
}

start_postgres() {
  docker-compose up -d postgres
}

main
