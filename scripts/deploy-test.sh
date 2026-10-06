#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_HOST="${DEPLOY_HOST:-omymind-test.notepidia.com}"
DEPLOY_USER="${DEPLOY_USER:-ubuntu}"
KEY="${DEPLOY_KEY:-}"
DEST="$DEPLOY_USER@$DEPLOY_HOST"
WEBSITE_DIR="/opt/notepidia/services/omymind-test"
SSH=(ssh -o BatchMode=yes -o ConnectTimeout=15 -o StrictHostKeyChecking=yes -i "$KEY")
SCP=(scp -O -C -o BatchMode=yes -o ConnectTimeout=15 -o StrictHostKeyChecking=yes -i "$KEY")

[[ -s "$ROOT/dist/client/index.html" && -s "$ROOT/dist/client/privacy.html" && -s "$ROOT/dist/client/terms.html" ]] || {
  echo "Static build is incomplete. Run NEXT_PUBLIC_SITE_URL=https://omymind-test.notepidia.com npm run build first." >&2
  exit 1
}
[[ -n "$KEY" && -r "$KEY" ]] || { echo "Set DEPLOY_KEY to a readable SSH key." >&2; exit 1; }
command -v tar >/dev/null && command -v shasum >/dev/null || { echo "tar and shasum are required." >&2; exit 1; }

STAGING="$(mktemp -d)"
cleanup() { python3 -c 'import pathlib,shutil,sys; shutil.rmtree(pathlib.Path(sys.argv[1]), ignore_errors=True)' "$STAGING"; }
trap cleanup EXIT

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
ARCHIVE="$STAGING/omymind-test-$STAMP.tar.gz"
COPYFILE_DISABLE=1 tar -czf "$ARCHIVE" -C "$ROOT/dist/client" .
CHECKSUM="$(shasum -a 256 "$ARCHIVE" | awk '{print $1}')"

"${SSH[@]}" "$DEST" \
  "sudo install -d -o ubuntu -g ubuntu '$WEBSITE_DIR/www' '$WEBSITE_DIR/backups' '$WEBSITE_DIR/release-$STAMP'; sudo install -d /opt/notepidia/backups/website"
"${SSH[@]}" "$DEST" \
  "if sudo test -e '$WEBSITE_DIR/www/index.html'; then sudo tar -C '$WEBSITE_DIR/www' -czf '$WEBSITE_DIR/backups/www-$STAMP.tgz' .; fi; sudo cp -a /opt/notepidia/compose/caddy/Caddyfile /opt/notepidia/backups/website/Caddyfile-$STAMP; sudo cp -a /opt/notepidia/compose/caddy/compose.yaml /opt/notepidia/backups/website/compose.yaml-$STAMP"

"${SCP[@]}" "$ARCHIVE" "$DEST:/home/ubuntu/omymind-test-$STAMP.tar.gz"
"${SSH[@]}" "$DEST" \
  "echo '$CHECKSUM  /home/ubuntu/omymind-test-$STAMP.tar.gz' | sha256sum -c - && sudo tar --no-same-owner --no-same-permissions -xzf '/home/ubuntu/omymind-test-$STAMP.tar.gz' -C '$WEBSITE_DIR/release-$STAMP' && sudo chown -R ubuntu:ubuntu '$WEBSITE_DIR/release-$STAMP' && if sudo test -d '$WEBSITE_DIR/www'; then sudo mv '$WEBSITE_DIR/www' '$WEBSITE_DIR/www-previous-$STAMP'; fi && sudo mv '$WEBSITE_DIR/release-$STAMP' '$WEBSITE_DIR/www'"

"${SCP[@]}" "$ROOT/deploy/Caddyfile" "$DEST:/tmp/omymind-test-Caddyfile"
"${SSH[@]}" "$DEST" \
  "sudo docker cp /tmp/omymind-test-Caddyfile notepidia-caddy:/tmp/omymind-test-Caddyfile && sudo docker exec notepidia-caddy caddy validate --config /tmp/omymind-test-Caddyfile --adapter caddyfile"

# Validate the candidate Compose configuration before changing the active file.
"${SSH[@]}" "$DEST" 'set -e; sudo cp /opt/notepidia/compose/caddy/compose.yaml /tmp/omymind-test-compose.yaml; sudo python3 -c '"'"'from pathlib import Path
p=Path("/tmp/omymind-test-compose.yaml")
lines=p.read_text().splitlines()
anchor="      - /opt/notepidia/data/caddy-config:/config"
website="      - /opt/notepidia/services/omymind-test/www:/srv/omymind-test:ro"
if anchor not in lines: raise SystemExit("Expected Caddy volume anchor is missing; no Compose changes made.")
if website not in lines: lines.insert(lines.index(anchor)+1, website)
p.write_text(chr(10).join(lines)+chr(10))
'"'"' && sudo docker compose -f /tmp/omymind-test-compose.yaml config --quiet && sudo cp /tmp/omymind-test-compose.yaml /opt/notepidia/compose/caddy/compose.yaml && sudo tee /opt/notepidia/compose/caddy/Caddyfile >/dev/null < /tmp/omymind-test-Caddyfile && sudo docker compose -f /opt/notepidia/compose/caddy/compose.yaml up -d --no-deps caddy && sudo docker inspect -f "{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{end}}" notepidia-caddy'

"${SSH[@]}" "$DEST" \
  'set -e; for i in 1 2 3 4 5; do if curl -kfsS --resolve omymind-test.notepidia.com:443:127.0.0.1 https://omymind-test.notepidia.com/ -o /tmp/omymind-test-home.html; then break; fi; sleep 2; done; curl -kfsS --resolve omymind-test.notepidia.com:443:127.0.0.1 https://omymind-test.notepidia.com/privacy?lang=zh -o /tmp/omymind-test-privacy.html; curl -kfsS --resolve omymind-test.notepidia.com:443:127.0.0.1 https://omymind-test.notepidia.com/terms?lang=zh -o /tmp/omymind-test-terms.html; curl -kfsS --resolve api-test.notepidia.com:443:127.0.0.1 https://api-test.notepidia.com/v1/readyz -o /dev/null; python3 -c "from pathlib import Path; tests={\"home\":(\"/tmp/omymind-test-home.html\",\"Find your moment.\"),\"privacy\":(\"/tmp/omymind-test-privacy.html\",\"隐私政策\"),\"terms\":(\"/tmp/omymind-test-terms.html\",\"服务条款\")}; [(print(name, \"OK\" if phrase in Path(path).read_text() else \"MISSING\"), Path(path).read_text() if phrase in Path(path).read_text() else exit(1)) for name,(path,phrase) in tests.items()]"; sudo docker ps --filter name=notepidia-caddy --format "{{.Names}} {{.Status}} {{.Ports}}"; sudo docker inspect -f "{{range .Mounts}}{{.Source}}:{{.Destination}}{{println}}{{end}}" notepidia-caddy'

"${SSH[@]}" "$DEST" \
  "sudo python3 -c 'from pathlib import Path; [Path(p).unlink(missing_ok=True) for p in (\"/home/ubuntu/omymind-test-$STAMP.tar.gz\", \"/tmp/omymind-test-Caddyfile\", \"/tmp/omymind-test-compose.yaml\", \"/tmp/omymind-test-home.html\", \"/tmp/omymind-test-privacy.html\", \"/tmp/omymind-test-terms.html\")]'"

echo "Deployment files, Caddy configuration, and local HTTPS routes are live and verified."
