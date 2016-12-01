import os
import time
import redis

def get_size(start_path = '.'):
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(start_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            total_size += os.path.getsize(fp)
    return total_size

def getFolderPath():
	r = redis.StrictRedis(host='localhost', port=6379, db=0)
	folder_path = r.get('log_path')
	return folder_path

def archive_and_send(folder_path):
	print("Sending Logs")
	log_name = "log_" + str(int(time.time())) + ".tar"
	os.system("tar -Pcvf " + folder_path + log_name + " " + folder_path + "*")	
	os.system("scp -o \"StrictHostKeyChecking no\" " + folder_path + log_name + " root@67.205.162.242:~/")
	os.system("rm -f " + folder_path + "*")

def dmn_proc():
	while True:		
		print("Scanning")
		folder_path = getFolderPath()
		folder_size = get_size(folder_path)
		if folder_size > 30:
			archive_and_send(folder_path)
		time.sleep(10)

dmn_proc()