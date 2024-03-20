
if [ "${APP}" = "" ]; then
    export APP=myapp2
fi
if [ "${ENV}" = "" ]; then
    export ENV=dev
fi
if [ "${NAMESPACE_APPEND}" = "" ] && [ "${ENV}" = "dev" ]; then
    export NAMESPACE_APPEND="-ns99"
fi
if [ "${CLUSTERDOMAIN}" = "" ]; then
    export CLUSTERDOMAIN=$(kubectl get secret -n grpl-system grsf-config -o jsonpath='{.data.clusterdomain}' | base64 --decode)
fi
if [ "${ENV}" = "prd" ]; then
    NAMESPACE="${APP}"
else
    NAMESPACE="${APP}-${ENV}${NAMESPACE_APPEND}"
fi
echo "APP: ${APP}"
echo "NAMESPACE: ${NAMESPACE}"
echo "CLUSTERDOMAIN: ${CLUSTERDOMAIN}"
