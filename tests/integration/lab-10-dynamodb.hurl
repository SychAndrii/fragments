# POST Route Test
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
# Body of the request
{ 
    "service": "DynamoDB" 
}

# We expect to get back an HTTP 201
HTTP/1.1 201
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# Try to GET the fragment we just posted by its URL
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
header "Content-Type" == "application/json; charset=utf-8"
jsonpath "$.fragment.id" == {{fragment1_id}}
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 31

POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
# Body of the request
`DynamoDB is **great**.`

# We expect to get back an HTTP 201
HTTP/1.1 201
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# Try to GET the fragment we just posted by its URL
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
header "Content-Type" == "text/markdown; charset=utf-8"
jsonpath "$.fragment.id" == {{fragment2_id}}
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 22

GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
# Check if the returned array includes the fragment ids
jsonpath "$.fragments" includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404

GET http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" includes {{fragment2_id}}