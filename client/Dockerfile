# Set nginx base image
FROM nginx

WORKDIR /home/mean
ADD . /home/mean

# Copy custom configuration file from the current directory
COPY nginx/nginx.conf /etc/nginx/nginx.conf
#COPY cert.pem /etc/ssl/cacert.pem
#COPY key.pem /etc/ssl/privkey.pem

