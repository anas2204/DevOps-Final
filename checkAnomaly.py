import time
from twilio.rest import TwilioRestClient

numberFrom = "+12674604763"
numberTo = "+13363921166"

def sendSms(TextMessage):
	account_sid = "AC8ed9f16559904a943f51e09f1f168a4c"
	auth_token = "84ea570cc74a7509948a34de10fee2d3"
	client = TwilioRestClient(account_sid, auth_token)
	#print(TextMessage)
	message = client.messages.create(to=numberTo, from_=numberFrom, body=TextMessage)


def checkForAnomaly():
	lines = [line.rstrip('\n') for line in open('/root/m4/logs.txt')]
	sendMessage = ""
	anomaly = False

	for line in lines:
		#print "%s" %line

		if(line.find("set") < 0) and (line.find("get") < 0):

			ip = line.split('!')[0]
			invalidURL = line.split('!')[1]

			sendMessage += ip+" is trying to access \""+invalidURL+"\"."
			anomaly = True
			#print(sendMessage)

	if anomaly == True:
		# print("Anomaly Detected, Sending Text!")
		#print(sendMessage)
		sendSms(sendMessage)


while True:

	checkForAnomaly()

	time.sleep(20)
