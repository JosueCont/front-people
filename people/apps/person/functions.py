from typing import Tuple

from django.contrib.sites import requests
from django.db import transaction
import requests

from people.apps.business.models import Node, Department, JobDepartment, NodePerson
from people.apps.khonnect.models import Config
from people.apps.person import serializers
import json

from people.apps.person.models import Person, Job


def decode_file_persons(persons):
    if persons:
        try:
            result = None
            for data in persons:
                if data["email"]:
                    result_person = None
                    # Es persona
                    person = Person()
                    person.first_name = data["first_name"]
                    person.flast_name = data["flast_name"]
                    person.mlast_name = data["mlast_name"]
                    person.email = data["email"]
                    person.curp = data["curp"]
                    person.code = data["code"]
                    password = data["password"]
                    # Verificando existencia de persona
                    try:
                        person_exist = Person.objects.get(email=data["email"])
                    except:
                        person_exist = None
                    if person_exist:
                        result_person = person_exist
                    else:
                        result_person = save_import_person(person, password, [])
                        # si devuelve la instancia de persona verificar que tenga un nodo y/o puesto
                    if result_person.id:
                        if data["parentid"]:
                            try:
                                node_p = Node.objects.get(code=data["parentid"])
                            except:
                                node_p = None
                            if node_p:
                                try:
                                    exist_nod_per = NodePerson.objects.get(person=result_person, node=node_p)
                                except:
                                    exist_nod_per = None
                                if exist_nod_per is None:
                                    node_person = NodePerson()
                                    node_person.node = node_p
                                    node_person.person = result_person
                                    node_person.save()
                            result_department = None
                            result_job = None
                        result_job_department = None
                        if data["department"]:
                            try:
                                exist_department = Department.objects.get(name=data["department"])
                            except:
                                exist_department = None
                            if exist_department:
                                result_department = exist_department
                            else:
                                department = Department()
                                department.name = data["department"]
                                department.description = data["department"]
                                department.code = data["department"]
                                department.save()
                                result_department = department
                        if data["job"]:
                            try:
                                exist_job = Job.objects.get(name=data["job"])
                            except:
                                exist_job = None
                            if exist_job:
                                result_job = exist_job
                            else:
                                job = Job()
                                job.name = data["job"]
                                job.code = data["code_job"]
                                job.save()
                                try:
                                    unit = Node.objects.get(code=data["parentid"])
                                except:
                                    unit = None
                                if unit:
                                    job.unit.add(unit)
                                    job.save()
                                result_job = job
                        if result_job and result_department:
                            try:
                                job_dep = JobDepartment.objects.get(job=result_job, department=result_department)
                            except:
                                job_dep = None
                            if job_dep is None:
                                job_dep = JobDepartment()
                                job_dep.job = result_job
                                job_dep.department = result_department
                                job_dep.save()
                                result_job_department = job_dep
                        if result_job_department:
                            result_person.job_department = result_job_department

                else:
                    if data["parentid"]:
                        # Es nodo con padre
                        result_node = None
                        try:
                            node_exist = Node.objects.get(code=data["code"])
                        except:
                            node_exist = None
                        if node_exist is None:
                            node = Node()
                            node.code = data["code"]
                            node.name = data["first_name"]
                            node.description = data["first_name"]
                            try:
                                parent = Node.objects.get(code=data["parentid"])
                            except:
                                parent = None
                            if parent:
                                node.parent = parent
                            node.save()
                            result_node = node
                        else:
                            # Probable update
                            node_exist.code = data["code"]
                            node_exist.name = data["first_name"]
                            node_exist.description = data["first_name"]
                            node_exist.pare = data["first_name"]
                            try:
                                parent = Node.objects.get(code=data["parentid"])
                            except:
                                parent = None
                            if parent:
                                node_exist.parent = parent
                            node_exist.save()
                            result_node = node_exist
                        if result_node:
                            result = 'ok'
                    else:
                        if data["code"]:
                            # Es nodo principal
                            result_node = None
                            try:
                                node_exist = Node.objects.get(code=data["code"])
                            except:
                                node_exist = None
                            if node_exist is None:
                                node = Node()
                                node.code = data["code"]
                                node.name = data["first_name"]
                                node.description = data["first_name"]
                                node.save()
                                result_node = node
                            else:
                                # Probable update
                                node_exist.code = data["code"]
                                node_exist.name = data["first_name"]
                                node_exist.description = data["first_name"]
                                node_exist.save()
                                result_node = node_exist
                            if result_node:
                                result = 'ok'
            return result
        except Exception as e:
            return e


def save_import_person(person, password, groups):
    instance = None
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
            if person.mlast_name is None:
                person.mlast_name = ""
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
                            return instance
                else:
                    return "error al guardar usuario"
            else:
                raise ValueError

    except Exception as e:
        return e


"""def save_import_node(data):
    result_node = None
    try:
        if data["parentid"]:
            # Es nodo con padre
            try:
                node = Node.objects.get(code=data["code"])
            except:
                node = None
            if node is None:
                node = Node()
                node.code = data["code"]
                node.name = data["first_name"]
                node.description = data["first_name"]
                try:
                    parent = Node.objects.get(code=data["parentid"])
                except:
                    parent = None
                if parent:
                    node.parent = parent
                node.save()
                result_node = node
                return result_node
            else:
                # Probable update
                result_node = node
                return result_node
        else:
            # Es nodo principal
            try:
                node_exist = Node.objects.get(code=data["code"])
            except:
                node = None
            if node_exist is None:
                node = Node()
                node.code = data["code"]
                node.name = data["first_name"]
                node.description = data["first_name"]
                node.save()
                result_node = node
                return result_node
            else:
                # Probable update
                node_exist.code = data["code"]
                node_exist.name = data["first_name"]
                node_exist.description = data["first_name"]
                node_exist.save()
                result_node = node_exist
                return result_node
    except Exception as e:
        return result_node"""
