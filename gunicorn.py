import socket
import multiprocessing

hostname = socket.gethostname()
num_workers = multiprocessing.cpu_count() * 2 + 1

if hostname == "kiuberto-server":
    command = '/home/kiuberto/.virtualenvs/lms/bin/gunicorn'
    pythonpath = '/home/kiuberto/Projects/lms/kuiz'
    bind = '0.0.0.0:8030'
else:
    command = '/home/ubuntu/.virtualenvs/kuiz/bin/gunicorn'
    pythonpath = '/home/ubuntu/kuiz'
    bind = '0.0.0.0:8000'

workers = num_workers
timeout = 120
