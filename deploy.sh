set -a
source .env
set +a
ssh $HOSTNAME "cd $REMOTE_PATH && git pull && npm install && sudo -S systemctl restart $SERVICE_NAME"