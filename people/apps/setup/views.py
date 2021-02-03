from django.shortcuts import render
from rest_framework import viewsets

from people.apps.setup import serializers
from people.apps.setup.models import Relationship, Bank, ExperienceType, ReasonSeparation, LaborRelationship, \
    DocumentType


class RelationshipViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RelationshipSerializer
    queryset = Relationship.objects.all()
    filterset_fields = ('code', 'name')


class BankViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.BankSerializer
    queryset = Bank.objects.all()
    filterset_fields = ('id', 'name')


class ExperienceTypeViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ExperienceTypeSerializer
    queryset = ExperienceType.objects.all()
    filterset_fields = ('code', 'name')


class ReasonSeparationViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ReasonSeparationSerializer
    queryset = ReasonSeparation.objects.all()
    filterset_fields = ('code', 'name')


class LaborRelationshipViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.LaborRelationshipSerializer
    queryset = LaborRelationship.objects.all()
    filterset_fields = ('code', 'name')


class DocumentTypeViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DocumentTypeSerializer
    queryset = DocumentType.objects.all()
    filterset_fields = ('code', 'name')
