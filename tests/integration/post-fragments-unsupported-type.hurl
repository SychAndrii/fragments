# POST Route Test
POST http://localhost:8080/v1/fragments
#Invalid Content Type
Content-Type: text/plean
[BasicAuth]
user1@email.com:password1
# Body of the request
`This is a fragment!`

# 1. We expect to get back an HTTP 415
HTTP/1.1 415
