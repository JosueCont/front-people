import os
from django.db import connection
from tempfile import SpooledTemporaryFile
from ..core.aws import MEDIAFILES_LOCATION
from storages.backends.s3boto3 import S3Boto3Storage


class MediaStorage(S3Boto3Storage):
    # location = MEDIAFILES_LOCATION + '/%s' % connection.tenant.schema_name

    @property
    def location(self):
        # _location = MEDIAFILES_LOCATION + '/%s' % connection.tenant.schema_name
        _location = f'{connection.tenant.schema_name}/people'
        return _location

    def _save_content(self, obj, content, parameters):
        """
        We create a clone of the content file as when this is passed to boto3 it wrongly closes
        the file upon upload where as the storage backend expects it to still be open
        """
        print(self.location)
        # Seek our content back to the start
        content.seek(0, os.SEEK_SET)

        # Create a temporary file that will write to disk after a specified size
        content_autoclose = SpooledTemporaryFile()

        # Write our original content into our copy that will be closed by boto3
        content_autoclose.write(content.read())

        # Upload the object which will auto close the content_autoclose instance
        super(MediaStorage, self)._save_content(obj, content_autoclose, parameters)

        # Cleanup if this is fixed upstream our duplicate should always close
        if not content_autoclose.closed:
            content_autoclose.close()
