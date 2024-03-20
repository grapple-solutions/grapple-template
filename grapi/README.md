# explanation
the grapi (grapple API) is based on loopback.
you can extend the backend by either using the grapi specification:
    kubectl explain grapi.spec

or by injections.

injections are usually being injected in form of:
- controllers:
    - just add a controller in "./grapi/controllers/*.controller.ts"
    - it will get picked up by the running grapi and will immediately be processed

