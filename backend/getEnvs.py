import base64

FILE = '.env'
DOKKU_APP = 'forji-backend'

f = open(FILE, 'r')

ls = f.readlines()

envs = []
for l in ls:
    if l[0] != '#' and '=' in l:
        key = l.split('=')[0]
        value = l.split('=')[1]
        enc = key+'='+base64.b64encode(value.replace('\n','').encode("ascii")).decode("ascii")
        envs.append(enc)
        
f.close()

print('dokku config:set --encoded ' + DOKKU_APP + ' ' + ' '.join(envs))