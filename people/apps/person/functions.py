from typing import Tuple

from django.contrib.sites import requests
from django.db import transaction
import requests

from people.apps.khonnect.models import Config
from people.apps.person import serializers
import json

from people.apps.person.models import Person


def decode_file_persons(persons):
    if persons:
        try:
            for data in persons:
                person = Person()
                person.first_name = data["first_name"]
                person.flast_name = data["flast_name"]
                person.mlast_name = data["mlast_name"]
                person.email = data["email"]
                person.curp = data["curp"]
                password = data["password"]
                result = save_import_person(person, password, [])
            if result:
                return 'OK'
        except Exception as e:
            return e


def save_import_person(person, password, groups):
    try:
        config = Config.objects.all().first()
        with transaction.atomic():
            password = str(password)
            instance = Person()
            if person.first_name:
                instance.first_name = person.first_name
            if person.flast_name:
                instance.flast_name = person.flast_name
            if person.mlast_name:
                instance.mlast_name = person.mlast_name
            if person.curp:
                instance.curp = person.curp
            if person.email:
                instance.email = person.email
            instance.save()
            headers = {'client-id': config.client_id, 'Content-Type': 'application/json'}
            url = f"{config.url_server}/signup/"
            data_ = {"first_name": person.first_name,
                     "last_name": person.flast_name + " " + person.mlast_name,
                     "email": person.email,
                     "password": password,
                     }
            if groups:
                data_['groups'] = groups
            response = requests.post(url, json.dumps(data_), headers=headers)
            if response.ok:
                resp = json.loads(response.text)
                if resp["level"] == "success":
                    if 'user_id' in resp:
                        if resp["user_id"]:
                            instance.khonnect_id = resp["user_id"]
                            instance.save()
                            person_json = serializers.PersonSerializer(instance).data
                            return person_json
                else:
                    return "error al guardar usuario"
            else:
                raise ValueError

    except Exception as e:
        return e
