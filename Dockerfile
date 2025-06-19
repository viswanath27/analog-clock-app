# Use nginx to serve static files
FROM nginx:alpine

# Copy the React build files to nginx html directory
COPY build/ /usr/share/nginx/html/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
