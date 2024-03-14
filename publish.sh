fp=$(ls $(ls -dt $TMPDIR/skaffold-helm* | head -n1)/*.tgz)
if [ "${HELM_REGISTRY}" != "" ]; then
    # aws ecr-public get-login-password \
    #     --region us-east-1 | helm registry login \
    #     --username AWS \
    #     --password-stdin $(echo ${HELM_REGISTRY} | sed "s,oci://,,g")
    # aws ecr-public create-repository --repository-name ${APP} --region us-east-1
    helm push ${fp} ${HELM_REGISTRY}
fi
