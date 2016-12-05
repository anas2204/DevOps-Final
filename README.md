# Milestone 4
Unity ID: asiddiq
Project: Live Deploy and Log monitoring

Screencast : https://www.youtube.com/watch?v=QvSINqmpzrA&feature=youtu.be

Class Presentation: [Presentation]

***
##Special Milestone
![][ArchPicture]

###Live Deploy
We have implemented an automated pipeline, that deploys an updated application without disrupting the services of the current one. We use Digital Ocean droplets to demonstrate our infrastructure setup. Whenever code is pushed, a shell [script] starts another droplet, and makes the proxy server re-direct all future requests to this new server (using a Global Redis Digital Ocean droplet). This ensures:

* No downtime
* Better user experience

###Log Backup and Monitoring
We have also incorporated the possibility of backing-up/analyzing log files. Since application logs can grow in size very fast, and they can provide valuable insight, this functionality shall aid in application monitoring significantly. After the log grows to a specific size (100 KB in our example), we email it to our servers, and delete the old file. Also, after a couple of seconds, we keep checking for suspicious attempts on our website, and if found, mail a message summary to the owner.
This use-case can be expanded to include Billing of users for an API, or detecting DDoS attacks on the website. The messaging service was setup using Twilio APIs.

###Summary Diagram
![][Summary]



[Summary]:https://github.ncsu.edu/bjhaver/CSC591_M4/blob/master/Summary.jpg
[ArchPicture]:https://github.ncsu.edu/bjhaver/CSC591_M4/blob/master/Architecture.jpg
[Presentation]:https://docs.google.com/presentation/d/15-6IiFIm0PVgkMcrBomweRoJCvF9U1KFKr0Bv0_N87c/edit?usp=sharing
[script]:https://github.ncsu.edu/bjhaver/CSC591_M4/blob/master/live_deploy.sh
