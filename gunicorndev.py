import multiprocessing
num_workers = multiprocessing.cpu_count() * 2 + 1
command = '/home/kiuberto/.virtualenvs/kuiz/bin/gunicorn'
pythonpath = '/home/kiuberto/Projects/kuiz'
bind = '0.0.0.0:8099'
workers = num_workers
timeout = 120
