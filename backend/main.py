from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Query(BaseModel):
    query: str


documents = [
    {
        "title": "Employment Agreement",
        "content": "Employees have to provide a 30-day notice before resignation. Employers may terminate employment for misconduct.",
    },
    {
        "title": "Rental Contract",
        "content": "Renter monthly rent is 10000tk and have to pay it before the 5th day of every month. Lease termination requires written notice.",
    },
    {
        "title": "Privacy Policy",
        "content": "User data must remain confidential and can not be shared with third parties.",
    },
]


@app.get("/")
def home():
    return {"message": "Legal Assistant"}


@app.post("/generate")
def generate(data: Query):

    text = data.query.strip().lower()
    query_words = text.split()

    found = []

    for item in documents:

        title = item["title"].lower()
        content = item["content"].lower()

        if any(word in title or word in content for word in query_words):

            found.append({
                "title": item["title"],
                "summary": item["content"]
            })

    if len(found) == 0:

        return {
            "success": False,
            "message": "No matching document found"
        }

    return {
        "success": True,
        "results": found
    }