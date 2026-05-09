from fastapi import FastAPI, HTTPException
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
        "summary": "Employees must give 30 days notice before resigning. Employers may terminate for misconduct.",
    },
    {
        "title": "Rental Contract",
        "content": "Renter monthly rent is 10000tk and have to pay it before the 5th day of every month. Lease termination requires written notice.",
        "summary": "Monthly rent of 10000tk is due by the 5th and termination must be submitted in writing.",
    },
    {
        "title": "Privacy Policy",
        "content": "User data must remain confidential and can not be shared with third parties.",
        "summary": "User data is confidential and can't be shared with third parties",
    },
]


@app.get("/")
def home():
    return {"message": "Legal Assistant"}


@app.post("/generate")
def generate(data: Query):

    try:
        text = data.query.strip().lower()
        query_words = text.split()

        if not query_words:
            raise HTTPException(
                status_code=400,
                detail="Query cannot be empty."
            )

        matched_doc = None
        max_score = 0

        for item in documents:

            title = item["title"].lower()
            content = item["content"].lower()

            score = 0

            for word in query_words:
                if word in title:
                    score += 2

                if word in content:
                    score += 1

            if score > max_score:
                max_score = score
                matched_doc = item

        if max_score == 0:
            return {
                "success": False,
                "message": "No matching document found"
            }

        return {
            "success": True,
            "results": [
                {
                    "title": matched_doc["title"],
                    "summary": matched_doc["summary"]
                }
            ]
        }
    
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")
    