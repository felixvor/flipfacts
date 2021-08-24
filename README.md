The project is not maintained at the moment. It was mainly used as a full stack learning experience. You might find a running version on https://flipfacts.net but it will probably go offline when the next server bill is due.


# flipfacts
FlipFacts is a website where you can post and rate short statements. However, rating does not just happen based on gut feeling: for each positive or negative rating you must provide a scholarly source that supports or contradicts the statement you want to rate.

## React Frontend
```
 cd react-frontend
 npm run build
```
then host the result from the build folder with nginx or apache


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
    	  proxy_pass http://localhost:7600;
	  proxy_set_header Host $host;
       	  proxy_set_header X-Real-IP $remote_addr;
       	  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       	  client_max_body_size 1M;
   }
   location /admin/ {
    	  proxy_pass http://localhost:7600;
	  proxy_set_header Host $host;
       	  proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	  client_max_body_size 1M;
   }
   ssl on;
   ssl_certificate ...
   ssl_certificate_key ...
   # on port 80 return 301 redirect to https (:443)
}

```
