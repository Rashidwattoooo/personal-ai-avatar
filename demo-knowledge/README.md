# Demo Knowledge Base (RAG Data)

> **NOTICE: FOR DEMONSTRATION PURPOSES ONLY**  
> All information in this directory is fictional demo data created solely to test and demonstrate Retrieval-Augmented Generation (RAG) capabilities with Tavus Knowledge Base. No real company or client data is represented.

---

## How to Connect Real Client Documents to Tavus RAG

1. Log in to your [Tavus Platform](https://platform.tavus.io).
2. Navigate to **Knowledge Base** (or **Documents**).
3. Click **Add Document** (or use the Tavus REST API `POST /v2/documents`).
4. Upload your real client document (PDF, TXT, Markdown, or docx).
5. Once processed, copy the generated `document_id` (e.g., `doc_1234567890abcdef`).
6. Paste the ID into your `.env.local` file:
   ```bash
   TAVUS_DOCUMENT_IDS="doc_1234567890abcdef"
   ```
   *(Multiple documents can be separated with commas: `doc_123,doc_456`)*
7. Restart or reload your Next.js application.

---

## Included Demo Document
- `demo-company-profile.md`: A mock sample document illustrating services, pricing, technical stack, and capabilities that can be uploaded to Tavus to test RAG retrieval questions (e.g. *"What AI automation services do you offer?"*, *"What is your typical project delivery timeline?"*).
