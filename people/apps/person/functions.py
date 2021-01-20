from typing import Tuple

from django.contrib.sites import requests
from django.db import transaction
import requests

from people.apps.khonnect.models import Config
from people.apps.person import serializers
import json

from people.apps.person.models import Person


def save_persons(persons):
    if persons:
        try:
            for data in persons:

                person = serializers.PersonCustomSerializer()
                person.first_name = data["first_name"]
                person.flast_name = data["flast_name"]
                person.mlast_name = data["mlast_name"]
                person.email = data["email"]
                person.password = data["password"]
                person.curp = data["curp"]
                #result = save(person)
            #if result:
                return 'OK'
        except Exception as e:
            return e

"""def save(data):
    try:
        serializer = serializers.PersonCustomSerializer(data)
        serializer.is_valid(raise_exception=True)
        config = Config.objects.all().first()
        with transaction.atomic():
            password = serializer.validated_data["password"]
            del serializer.validated_data['password']
            instance = Person(**serializer.validated_data)
            instance.save()
            headers = {'client-id': config.client_id, 'Content-Type': 'application/json'}
            url = f"{config.url_server}/signup/"
            data_ = {"first_name": serializer.validated_data["first_name"],
                     "last_name": serializer.validated_data["flast_name"] + " " + serializer.validated_data[
                         "mlast_name"],
                     "email": serializer.validated_data["email"],
                     "password": password,
                     }
            if 'groups' in serializer.validated_data:
                data_['groups'] = serializer.validated_data["groups"]
            response = requests.post(url, json.dumps(data_), headers=headers)
            if response.ok:
                resp = json.loads(response.text)
                if resp["level"] == "success":
                    if 'user_id' in resp:
                        if resp["user_id"]:
                            validate_data = serializer.validated_data
                            # del validate_data['password']
                            if 'groups' in serializer.validated_data:
                                del validate_data['groups']
                            instance.khonnect_id = resp["user_id"]
                            instance.save()
                            person_json = serializers.PersonSerializer(instance).data
                            return  "ok"
                else:
                    return "error al guardar usuario"
            else:
                raise ValueError

    except Exception as e:
        return  e"""
