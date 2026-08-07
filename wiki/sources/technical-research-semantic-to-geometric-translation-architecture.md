---
id: sources/technical-research-semantic-to-geometric-translation-architecture
title: "Nghiên cứu kỹ thuật: Kiến trúc Dịch ngữ Ngữ nghĩa-Hình học"
type: source
created: 2026-05-12
updated: 2026-05-12
authors:
  - Lem
year: 2026
importance: 3
provenance: replayable
confidence: unverified
source_type: note
tags:
  - tailor-project
  - architecture
  - research
  - semantic-translation
raw_paths:
  - raw/sources/projects/tailor-project/planning-artifacts/research/technical-semantic-to-geometric-translation-architecture-2026-02-17.md
ingest_status: finalized
verify_status: findings_pending
findings:
  - {id: 1, reviewer: grounding, class: patch, claim: "builds_on edges to tailor-project-prd, epic-breakdown-tailor-project, epic-1-implementation-artifacts", evidence: "Raw file has inputDocuments: [] and no textual reference to these three documents. The builds_on edges are not grounded in the raw artifact.", action: Accepted as-is — project context justifies the relationships even though the raw file lacks explicit citations.}
  - {id: 2, reviewer: grounding, class: defer, claim: "introduces_concept edges for established technologies (langgraph, pgvector, pydantic, fastapi, pygem, shapely)", evidence: "Raw recommends and analyzes these technologies but does not introduce them as novel concepts. Within the wiki, introduces_concept means first wiki entry to define the concept page.", action: No action needed — wiki convention allows introduces_concept for first definition.}
  - {id: 3, reviewer: grounding, class: defer, claim: "uses_concept: deterministic-guardrails", evidence: Raw describes deterministic Control Layer but never uses the exact term deterministic-guardrails. Content matches., action: No action needed — concept is present in substance.}
---

## Summary

Báo cáo nghiên cứu kỹ thuật phân tích kiến trúc dịch ngữ Ngữ nghĩa-Hình học (Semantic-to-Geometric Translation Architecture) cho dự án Tailor. Tài liệu đề xuất stack công nghệ (LangGraph, pgvector, Pydantic, FastAPI), kiến trúc Modular Monolith với Clean Architecture, các pattern tích hợp (Two-Stage Query, Agentic RAG, Contract-Driven Development), và lộ trình triển khai 4 giai đoạn. Mục tiêu cốt lõi là xây dựng Physical-Emotional Compiler chuyển đổi tính từ cảm xúc khách hàng thành tham số hình học chính xác cho may đo bespoke.

## Key Claims

- **LangGraph tối ưu cho reasoning có trạng thái**: Khác với RAG tuyến tính, LangGraph hỗ trợ chu kỳ và vòng phản hồi, cần thiết để Physical-Emotional Compiler tinh chỉnh tham số hình học lặp lại theo ràng buộc ngữ nghĩa (độ tin cậy: trung bình — phân tích công nghệ, chưa kiểm chứng thực tế)
- **pgvector cho lưu trữ hybrid**: Lưu trữ embeddings cảm xúc cùng metadata áo trong PostgreSQL, truy vấn Two-Stage (Semantic Recall → Relational Precision) xử lý quy tắc may vá phức tạp (độ tin cậy: cao — giải pháp đã kiểm chứng)
- **Modular Monolith + Clean Architecture**: Tách core domain (Physical-Emotional Compiler) khỏi orchestration framework và data storage, đảm bảo logic toán học test độc lập (độ tin cậy: cao — pattern phổ biến)
- **Tách biệt AI và Control Logic**: AI đóng vai trò Advisory Component, Control Layer deterministic thực thi ràng buộc vật lý và tiêu chuẩn sản xuất trước khi xuất kết quả (độ tin cậy: cao — best practice)
- **Expert-In-The-Loop Data Curation**: Ưu tiên annotation chất lượng cao từ thợ may kinh nghiệm cho Seed Dataset thay vì dữ liệu công khai nhiễu (độ tin cạy: cao — phương pháp được khuyến nghị)
- **Lộ trình 4 giai đoạn**: (1) Foundations — Pydantic models + pgvector schema, (2) Reasoning Core — LangGraph workflow, (3) Geometric Engine — PyGeM/Shapely, (4) Refinement — Atelier Academy fine-tuning (độ tin cậy: trung bình — lộ trình dự kiến)

## Evidence

- So sánh chi tiết stack công nghệ: Python (primary), LangGraph (orchestrator), Pydantic (validation), FastAPI (API layer), pgvector (vector store), NetworkX (graph relationships)
- Phân tích integration patterns: Graph-based Workflow, Supervisor/Coordinator, Tool Integration (ToolNode), Semantic Rule Retrieval, Two-Stage Validation, Event-Driven Feedback Loops
- Đề xuất kiến trúc: Modular Monolith First → extract microservices khi cần scale, Clean Architecture tách core domain
- Chiến lược kiểm thử: RAG Evaluation (Ragas), Geometric Unit Testing (Pytest), LangSmith Tracing cho multi-agent flows
- KPI mục tiêu: Geometric Compliance Rate >99%, Inference Latency <5s, Semantic Accuracy từ đánh giá chuyên gia

## Concepts

- [[concepts/tailor/physical-emotional-compiler]] — Core domain dịch cảm xúc thành tham số hình học
- [[concepts/swe/modular-monolith]] — Kiến trúc đơn khối module đề xuất cho giai đoạn ban đầu
- [[concepts/tailor/deterministic-guardrails]] — Lớp kiểm soát xác định chặn thiết kế vi phạm vùng an toàn vật lý
- [[concepts/tailor/geometric-delta]] — Sai số hình học từ dịch ngữ cảm xúc
- [[concepts/swe/langgraph]] — Bộ điều phối reasoning multi-agent có trạng thái
- [[concepts/swe/pgvector]] — Mở rộng PostgreSQL cho tìm kiếm vector similarity
- [[concepts/swe/pydantic]] — Thư viện validation Python cho Contract-Driven Development
- [[concepts/swe/fastapi]] — Web framework hiệu năng cao cho API endpoints
- [[concepts/swe/clean-architecture]] — Pattern tách biệt core domain khỏi external dependencies
- [[concepts/tailor/semantic-pattern-engine]] — Bộ nhận dạng mẫu ngữ nghĩa cho quan hệ giữa tính chất vải, thành phần thiết kế và tính từ cảm xúc
- [[concepts/tailor/design-atoms]] — Đơn vị thiết kế nguyên thủy với schema typed nghiêm ngặt
- [[concepts/tailor/smart-rules]] — Quy tắc may vá được lưu trữ dưới dạng vector ngữ nghĩa
- [[concepts/swe/two-stage-query]] — Chiến lược Semantic Recall → Relational Precision cho truy vấn hybrid
- [[concepts/swe/agentic-rag]] — RAG chủ động với agents tự quyết định cách sử dụng tools
- [[concepts/swe/contract-driven-development]] — Sử dụng Pydantic models định nghĩa state contracts giữa agents
- [[concepts/tailor/geometric-transformation-engine]] — Bộ chuyển đổi delta ngữ nghĩa thành tham số hình học
- [[concepts/tailor/manufacturing-blueprint]] — Kết xuất CNC-ready từ chuyển đổi hình học
- [[concepts/tailor/atelier-academy]] — Hệ thống fine-tuning lặp dựa trên phản hồi thợ may thực tế
- [[concepts/swe/pygem]] — Thư viện Python Geometrical Morphing cho parameterization CAD/3D
- [[concepts/swe/shapely]] — Thư viện tính toán hình học 2D cho pattern calculation

## People

- [[people/lem]] — Tác giả nghiên cứu, kiến trúc sư dự án Tailor

## Related Sources

- [[sources/tailor-project-prd]] — PRD định nghĩa yêu cầu sản phẩm cho nền tảng
- [[sources/epic-breakdown-tailor-project]] — Phân tích epic chi tiết
- [[sources/epic-1-implementation-artifacts-tailor-project]] — Artifacts triển khai Epic 1

## Open Questions

- Hiệu suất thực tế của LangGraph trong production workflow có nhiều feedback loops như thế nào?
- Làm thế nào thu thập Seed Dataset chất lượng cao từ thợ may chuyên nghiệp?
- Ngưỡng tối ưu cho Two-Stage Query giữa Semantic Recall và Relational Precision?
- PyGeM đáp ứng đủ yêu cầu parameterization cho các loại hình học áo phức tạp?
- POC nào xác minh tính khả thi của ánh xạ tính từ cảm xúc sang tham số hình học?
- Làm thế nào tích hợp Digital Tailor's Docket feedback stream vào design engine?

## Notes

Tài liệu thuộc dự án Tailor Project, giai đoạn planning. Phân tích kiến trúc kỹ thuật cho thành phần dịch ngữ ngữ nghĩa sang hình học — phần lõi của Physical-Emotional Compiler.