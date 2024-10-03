if [[ -z "${SVELTE_APP_REMOTE_URL}" ]] && [[ "${REMOTE_ENTRY_URL}" != "" ]]; then
    export SVELTE_APP_REMOTE_URL=$(echo ${REMOTE_ENTRY_URL} | sed "s,/remoteEntry.js,,g")
fi

if [[ -z "${CONTAINER_NAME}" ]]; then
    export CONTAINER_NAME=$(curl -s -k $SVELTE_APP_REMOTE_URL/dashboard.json | jq -r '.name')
    echo "CONTAINER_NAME: ${CONTAINER_NAME}"
fi

echo "SVELTE_APP_REMOTE_URL = ${SVELTE_APP_REMOTE_URL}"
if [[ -z "${DEV}" ]]; then
    echo "testing: curl -k -Is ${SVELTE_APP_REMOTE_URL}/dashboard.json | head -1"
    # timeout 600 sh -c "while ! curl -k -Is ${SVELTE_APP_REMOTE_URL}/dashboard.json 2>/dev/null | head -1 | grep 200; do sleep 1; echo -n '.'; done" || echo "\n\nERROR: could not reach: ${SVELTE_APP_REMOTE_URL}/dashboard.json after 10 minutes"
    while ! curl -k -Is ${SVELTE_APP_REMOTE_URL}/dashboard.json 2>/dev/null | head -1 | grep 200; do
        sleep 1
        echo -n '.'
    done || echo "\n\nERROR: could not reach: ${SVELTE_APP_REMOTE_URL}/dashboard.json after 10 minutes"

    echo "testing: curl -k ${SVELTE_APP_REMOTE_URL}/dashboard.json | jq ."
    echo "wait until it is returning a json object..."
    while ! curl -k ${SVELTE_APP_REMOTE_URL}/dashboard.json 2>/dev/null | jq . >/dev/null; do
        sleep 1
        echo -n '.'
    done || echo "\n\nERROR: ${SVELTE_APP_REMOTE_URL} did not return a json object..."
    
    pnpm build
    cp /app/dist/* /usr/share/nginx/html/.
    nginx -g 'daemon off;'
else

    pnpm dev
fi
