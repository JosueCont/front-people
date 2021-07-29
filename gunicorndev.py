import multiprocessing
num_workers = multiprocessing.cpu_count() * 2 + 1
command = '/home/kiuberto/.virtualenvs/people/bin/gunicorn'
pythonpath = '/home/kiuberto/Projects/people'
bind = '0.0.0.0:8040'
workers = num_workers
timeout = 120
