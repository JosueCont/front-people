from django.views.generic import View
from django.http import JsonResponse
from people.settings import json_settings

settings = json_settings()

class Starter(View):
    """
    Esta vista sirve solamente para consultar si el servicio se encuentra activo.
    """
    def get(self, request):
        if settings['USE_HTTPS']:
            api_url = "https://"
        else:
            api_url = "http://"
        server_port = request.environ.get('SERVER_PORT', None)
        if server_port:
            api_url += f"{request.tenant.domain_url}:{server_port}"
        else:
            api_url += f"{request.tenant.domain_url}"
        json_object = {'info': "API Service Ready", 'api-documentation': f'{api_url}/api/doc/'}
        return JsonResponse(json_object)
