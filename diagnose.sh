set -a
source .env
set +a
ssh $HOSTNAME "sudo -S journalctl -u $SERVICE_NAME -n 60 --no-pager"