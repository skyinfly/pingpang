import re

with open('/home/ubuntu/pingpang/nginx-gateway.conf', 'r') as f:
    content = f.read()

# Replace the specific proxy_pass line under location /admin/
new_content = content.replace('proxy_pass http://$admin_host:80/;', 'rewrite ^/admin/(.*) /$1 break;\n    proxy_pass http://$admin_host:80;')

with open('/home/ubuntu/pingpang/nginx-gateway.conf', 'w') as f:
    f.write(new_content)
