# Dockerfile for React + Nginx
FROM nginx:alpine

COPY dist/ /usr/share/nginx/html

# (선택) 기본 nginx.conf를 덮어쓰려면
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
