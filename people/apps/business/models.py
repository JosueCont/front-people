import os
from django.db import models
from django.utils.translation import gettext as _
from people.apps.person.models import Person, Job
from people.apps.functions import get_clean_uuid

app_label = 'business'


# Create your models here.
class Node(models.Model):
    def image_path(self, filename):
        path = "nodes/{0}/".format(str(self.id))
        ext = filename.split('.')[-1]
        my_filename = "{0}.{1}".format(self.name, ext)
        url = os.path.join(path, my_filename)
        return url

    name = models.CharField(max_length=350)
    description = models.CharField(max_length=1000)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)
    active = models.BooleanField(default=True)
    image = models.ImageField(max_length=1000, upload_to=image_path, null=True, blank=True)
    code = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        app_label = app_label
        verbose_name = _("Nodo organizacional")
        verbose_name_plural = _("Nodos organizacionales")

    @staticmethod
    def traverse_node_json(node):
        json_nodes = []
        for child in node.all_childs:
            json_node = {}
            json_node["value"] = child.id
            json_node["label"] = child.name
            children = Node.traverse_node_json(child)
            json_node["children"] = children
            json_nodes.append(json_node)
        return json_nodes

    @staticmethod
    def traverse_node_ids(node):
        ids = []
        for child in node.all_childs:
            ids.append(child.id)
            resulting_ids = Node.traverse_node_ids(child)
            ids += resulting_ids
        return ids

    @property
    def all_childs(self):
        return self.node_set.all()

    @property
    def descendant_ids(self):
        return Node.traverse_node_ids(self)

    @property
    def parent_name(self):
        return self.parent.name if self.parent else ""

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code,
            "hasChildren": self.node_set.exists(),
            "description": self.description,
            "parent": self.parent.id if self.parent else None,
            "parent_name": self.parent.name if self.parent else None
        }


class NodePerson(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    node = models.ForeignKey('Node', on_delete=models.CASCADE)

    def __str__(self):
        return self.person.first_name + " - " + self.node.name

    class Meta:
        app_label = app_label
        verbose_name = _("Responsable de un nodo organizacional")
        verbose_name_plural = _("Responsables de nodos organizacionales")


class Department(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    name = models.CharField(max_length=350)
    description = models.CharField(max_length=1000)
    code = models.CharField(max_length=200, null=True, blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Departamento")
        verbose_name_plural = _("Departamentos")


class JobDepartment(models.Model):
    job = models.ForeignKey('person.Job', on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    def __str__(self):
        return self.job.name + " - " + self.department.name

    class Meta:
        app_label = app_label
        verbose_name = _("Puesto de trabajo de departamento")
        verbose_name_plural = _("Puestos de trabajo de departamentos")