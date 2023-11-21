POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
# Body of the request
`Hello S3!`

HTTP/1.1 201
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
header "Content-Type" startsWith "text/plain"
body == "Hello S3!"

DELETE {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404