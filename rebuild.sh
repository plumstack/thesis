docker stop socialnights && docker rm socialnights && docker build -t socialnights . && docker run --name socialnights -p 8585:8080 -d socialnights 
