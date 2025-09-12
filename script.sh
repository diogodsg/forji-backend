#!/usr/bin/env zsh
set -e
API=${API:-http://localhost:3000}

need() { command -v $1 >/dev/null 2>&1 || { echo "Missing dependency: $1"; exit 1; }; }
need curl
need jq

echo "==> Seeding complete mock dataset on $API"

# --- Optional helpers ---
has() { command -v $1 >/dev/null 2>&1; }

# Auth helper: registers if missing, otherwise logs in; prints access_token
get_token() {
  local name="$1" email="$2" password="$3"
  local out token
  out=$(curl -sS -X POST "$API/auth/register" -H 'Content-Type: application/json' \
    -d "{\"name\":\"$name\",\"email\":\"$email\",\"password\":\"$password\"}") || true
  token=$(echo "$out" | jq -r '.access_token // empty')
  if [[ -z "$token" ]]; then
    token=$(curl -sS -X POST "$API/auth/login" -H 'Content-Type: application/json' \
      -d "{\"email\":\"$email\",\"password\":\"$password\"}" | jq -r .access_token)
  fi
  echo -n "$token"
}

echo "==> Ensuring database is up"
if has docker; then
  if ! docker ps --format '{{.Names}}' | grep -q '^forge_postgres$'; then
    echo "   • Starting Postgres container via docker compose"
    docker compose -f backend/docker-compose.yml up -d db >/dev/null
  fi
  if has nc; then
    echo -n "   • Waiting for Postgres on localhost:5433"
    for i in {1..60}; do
      if nc -z localhost 5433 2>/dev/null; then echo " ✓"; break; fi
      echo -n "."; sleep 0.5;
      if [[ $i -eq 60 ]]; then echo "\n   ! Timeout waiting for DB"; fi
    done
  else
    sleep 2
  fi
else
  echo "   • Docker not found; assuming DB is already running"
fi

echo "==> Resetting database schema"
if has npx; then
  if (cd backend && npx --yes prisma migrate reset --force --skip-seed >/dev/null); then
    echo "   • Prisma migrate reset done"
  else
    echo "   ! Prisma reset failed, trying SQL drop schema (docker only)"
    if has docker; then
      docker exec -i forge_postgres psql -U forge_user -d forge_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" >/dev/null
      echo "   • Schema dropped; reapplying migrations"
      (cd backend && npx --yes prisma migrate deploy >/dev/null)
    else
      echo "   ! Cannot reset DB without docker or prisma; aborting" && exit 1
    fi
  fi
else
  echo "   ! npx not found; attempting SQL drop schema via docker"
  if has docker; then
    docker exec -i forge_postgres psql -U forge_user -d forge_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" >/dev/null
    echo "   • Schema dropped; migrations may need to be applied manually"
  else
    echo "   ! Neither npx nor docker available; aborting" && exit 1
  fi
fi

echo "==> Waiting for API at $API"
if has curl; then
  echo -n "   • Checking /auth/login"
  for i in {1..60}; do
    code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API/auth/login" -H 'Content-Type: application/json' -d '{"email":"_","password":"_"}' || true)
    if [[ "$code" != "000" ]]; then echo " ✓"; break; fi
    echo -n "."; sleep 0.5
    if [[ $i -eq 60 ]]; then echo "\n   ! Timeout waiting for API"; exit 1; fi
  done
fi

echo "==> Creating admin user (first user becomes admin)"
admin_token=$(get_token "Root Admin" "admin@example.com" "pass123")
if [[ -z "$admin_token" ]]; then
  echo "   ! Failed to obtain admin token" && exit 1
fi

echo "==> Creating users via admin endpoint"
curl -sS -X POST "$API/auth/admin/create-user" -H "Authorization: Bearer $admin_token" -H 'Content-Type: application/json' \
  -d '{"name":"Alice Manager","email":"alice.manager@example.com","password":"pass123"}' | jq -cr '.id // .message // .error // empty' || true
curl -sS -X POST "$API/auth/admin/create-user" -H "Authorization: Bearer $admin_token" -H 'Content-Type: application/json' \
  -d '{"name":"Bob Dev","email":"bob.dev@example.com","password":"pass123"}' | jq -cr '.id // .message // .error // empty' || true
curl -sS -X POST "$API/auth/admin/create-user" -H "Authorization: Bearer $admin_token" -H 'Content-Type: application/json' \
  -d '{"name":"Carol Dev","email":"carol.dev@example.com","password":"pass123"}' | jq -cr '.id // .message // .error // empty' || true

mgr_token=$(get_token "Alice Manager" "alice.manager@example.com" "pass123")
dev1_token=$(get_token "Bob Dev" "bob.dev@example.com" "pass123")
dev2_token=$(get_token "Carol Dev" "carol.dev@example.com" "pass123")

echo "==> Fetching user IDs"
mgr_id=$(curl -sS -H "Authorization: Bearer $mgr_token" "$API/auth/me" | jq -r .id)
dev1_id=$(curl -sS -H "Authorization: Bearer $dev1_token" "$API/auth/me" | jq -r .id)
dev2_id=$(curl -sS -H "Authorization: Bearer $dev2_token" "$API/auth/me" | jq -r .id)

echo "Manager=$mgr_id Dev1=$dev1_id Dev2=$dev2_id"

echo "==> Setting manager relations (admin)"
curl -sS -X POST "$API/auth/admin/set-manager" -H "Authorization: Bearer $admin_token" -H 'Content-Type: application/json' \
  -d "{\"userId\": $dev1_id, \"managerId\": $mgr_id}" | jq -c '{userId:.id, managers:.managers|map(.id)}'

curl -sS -X POST "$API/auth/admin/set-manager" -H "Authorization: Bearer $admin_token" -H 'Content-Type: application/json' \
  -d "{\"userId\": $dev2_id, \"managerId\": $mgr_id}" | jq -c '{userId:.id, managers:.managers|map(.id)}'

echo "==> Current reports"
curl -sS -H "Authorization: Bearer $mgr_token" "$API/auth/my-reports" | jq -c '.'

echo "==> Seeding PRs (ignoring conflicts)"
seed_pr() {
  local id=$1 title=$2 repo=$3 state=$4 created=$5 added=$6 deleted=$7 changes=$8 user=$9 owner=${10}
  curl -sS -X POST "$API/prs" -H "Authorization: Bearer $mgr_token" -H 'Content-Type: application/json' \
    -d "{\"id\": $id, \"title\": \"$title\", \"repo\": \"$repo\", \"state\": \"$state\", \"created_at\": \"$created\", \"total_additions\": $added, \"total_deletions\": $deleted, \"total_changes\": $changes, \"user\": \"$user\", \"ownerUserId\": $owner }" \
    | jq -cr '.id // .message // .error // empty' || true
}

# Bob Dev PRs (frontend + backend, várias situações)
seed_pr 1001 "Feat: auth flow"              "forge-frontend" "open"    "2025-09-01T10:00:00Z" 250 30 8  "bob"   $dev1_id
seed_pr 1002 "Fix: login debounce"          "forge-frontend" "merged"  "2025-09-03T12:00:00Z" 40  12 2  "bob"   $dev1_id
seed_pr 1003 "Refactor: UI tokens"          "forge-frontend" "closed"  "2025-09-04T15:00:00Z" 80  60 3  "bob"   $dev1_id
seed_pr 1101 "Chore: bump deps"             "forge-backend"  "open"    "2025-09-05T09:30:00Z" 12  3  1  "bob"   $dev1_id

# Carol Dev PRs
seed_pr 2001 "Chore: prisma migrate"         "forge-backend"  "open"    "2025-09-05T09:00:00Z" 10  0  1  "carol" $dev2_id
seed_pr 2002 "Refactor: PDI service"         "forge-backend"  "closed"  "2025-09-06T14:00:00Z" 120 80 5  "carol" $dev2_id
seed_pr 2003 "Feat: PR filters by owner"     "forge-backend"  "merged"  "2025-09-07T10:30:00Z" 60  10 2  "carol" $dev2_id
seed_pr 2101 "Fix: timezone parsing"         "forge-frontend" "open"    "2025-09-08T18:45:00Z" 25  5  1  "carol" $dev2_id

echo "==> Seeding PDIs for reports"
# Helper to PUT a full PDI plan for a given user id
seed_pdi() {
  local uid=$1
  curl -sS -X PUT "$API/pdi/$uid" -H "Authorization: Bearer $mgr_token" -H 'Content-Type: application/json' \
    -d '{
      "competencies": ["React", "TypeScript", "Prisma", "Arquitetura"],
      "milestones": [
        {
          "id": "m1",
          "date": "2025-08-28",
          "title": "Kickoff de PDI",
          "summary": "Definição de objetivos, áreas prioritárias e combinação de encontros quinzenais.",
          "positives": ["Boa clareza de objetivos"],
          "improvements": ["Detalhar métricas de sucesso"],
          "resources": ["https://roadmap.sh/frontend"],
          "tasks": [
            {"id": "t1", "title": "Listar gaps técnicos"},
            {"id": "t2", "title": "Selecionar 2 katas de refatoração", "done": true}
          ],
          "suggestions": ["Criar rotina semanal de estudo (2h)"]
        },
        {
          "id": "m2",
          "date": "2025-09-04",
          "title": "Primeiro acompanhamento",
          "summary": "Revisão de PRs da semana e qualidade de testes.",
          "positives": ["Boa evolução em testes de componentes"],
          "improvements": ["Diminuir complexidade de componentes"],
          "resources": ["https://kentcdodds.com/blog/"],
          "tasks": [
            {"id": "t3", "title": "Refatorar componente complexo"},
            {"id": "t4", "title": "Adicionar teste de snapshot", "done": true}
          ],
          "suggestions": ["Adicionar lint rule para complexidade"]
        }
      ],
      "krs": [
        {
          "id": "kr1",
          "description": "Reduzir tempo de revisão de PR em 20%",
          "successCriteria": "Média de tempo para merge < 2 dias",
          "currentStatus": "Em andamento",
          "improvementActions": ["Templates de PR", "Checklist pré-merge"]
        },
        {
          "id": "kr2",
          "description": "Aumentar cobertura de testes em 15%",
          "successCriteria": "+15pp em módulos críticos"
        }
      ],
      "records": [
        {"area": "Componentes UI"},
        {"area": "APIs Prisma"},
        {"area": "Boas práticas TS"}
      ]
    }' | jq -cr '{userId:.userId, milestones:(.milestones|length), krs:(.krs|length)}' || true
}

seed_pdi $dev1_id
seed_pdi $dev2_id

echo "==> Done"