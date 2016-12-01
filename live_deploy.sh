#!/bin/sh

echo "Starting digital ocean droplet......."
#Start Digital ocean instances.
new_ip=`python digitalspawn.py`
echo "Started new droplet with new_ip=${new_ip}"

echo "Running the playbook to deploy new codebase"
#Run the ansible playbook

echo "Deployed the codebase successfully..."

echo "Updating the redis store with new ip"
#Update the redis store i.e. clean first and add the latest
redis_ip=$1
redis-cli -h $redis_ip del ip_list
redis-cli -h $redis_ip lpush ip_lis $new_ip

echo "Successfully Deployed new codebase !!!"