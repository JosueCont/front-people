import uuid


def get_clean_uuid():
    return str(uuid.uuid4().hex)
