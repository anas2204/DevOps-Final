import digitalocean
import time
import os

tokenNode = "ba8556485ae12aa5e08c627cf3a4a6df145cd9fef8fd11d21d4c2a076854254d"

manager = digitalocean.Manager(token=tokenNode)
keys = manager.get_all_sshkeys()
droplet = digitalocean.Droplet(token=tokenNode,
                               name='newDroplet-Anas',
                               region='ams3',
                               image='ubuntu-14-04-x64',
                               size_slug='512mb',
                               ssh_keys=keys,
                               backups=False)
droplet.create()

actions = droplet.get_actions()

for action in actions:
    action.load()
    #print action.status
    while action.status != "completed":
        time.sleep(5)
        action.load()

#print ("VM Started")

my_droplets = manager.get_all_droplets()
droplet = my_droplets[-1]

fileObj = open('inventory','w')
print droplet.ip_address
#os.environ["new_ip"] = "1"
fileObj.write("node1 ansible_ssh_host="+str(droplet.ip_address)+" ansible_ssh_user=root ansible_ssh_private_key_file=/Users/bhargav/.ssh/id_rsa")
fileObj.close();