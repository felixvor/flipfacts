# flipfacts
FlipFacts is a website where you can post and rate short statements. However, rating does not just happen based on gut feeling: for each positive or negative rating you must provide a scholarly source that supports or contradicts the statement you want to rate.

## React Frontend
```
 cd react-frontend
 npm run build
```
then host the result from the build folder with nginx or apache

the frontend will send requests to the /api/ route. make sure your server forwards /api/ to the port of the backend
there is also an admin panel on /admin/ hosted by the backend. the user has to be logged into an admin account to access.

-NGINX example config:
```
server {
	listen 443;
	listen [::]:443;	
	root /var/www/flipfacts;
	index index.html;
	server_name flipfacts.net www.flipfacts.net; 
        location / {
	  root /var/www/flipfacts;
	  try_files $uri /index.html;
	}

	location /api/ {
    		proxy_pass http://localhost:8000;
    		proxy_http_version 1.1;
		    proxy_set_header Host $host;
       	proxy_set_header X-Real-IP $remote_addr;
       	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       	client_max_body_size 2M;
	}
  location /admin/ {
    		proxy_pass http://localhost:8000;
    		proxy_http_version 1.1;
		    proxy_set_header Host $host;
       	proxy_set_header X-Real-IP $remote_addr;
       	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	}
  ssl on;
  ssl_certificate ...
  ssl_certificate_key ...
  # on port 80 return 301 redirect to https (:443)
}

```

## Backend
Development Server:
```
 cd flask-backend
 python run.py
```
`gunicorn` is recommended for productive environment
``` 
cd flask-backend
gunicorn [workers, threads, port, forward-ips, timeout, ...] run:app 
```
