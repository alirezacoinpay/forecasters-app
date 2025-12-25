# Design: Rename Question to Prediction

## Context
The codebase currently uses mixed terminology between "question" and "prediction" throughout the application. This inconsistency creates confusion and makes the codebase harder to maintain. The domain model uses "prediction" as the primary term, so all "question" references should be standardized to "prediction".

## Goals
- Achieve 100% consistency in terminology across the entire codebase
- Rename all variables, functions, types, API endpoints, and payloads from "question" to "prediction"
- Update directory structure to reflect the new naming
- Update translation keys for user-facing strings
- Ensure all comments and documentation use consistent terminology

## Non-Goals
- Changing the actual functionality or behavior of the application
- Modifying the data model structure (only renaming fields)
- Changing UI/UX text that users see (only internal code changes)

## Decisions

### Decision: Comprehensive Rename Strategy
**What:** Rename all occurrences of "question" to "prediction" in a single coordinated change.
**Why:** Partial renames create confusion and technical debt. A comprehensive rename ensures consistency.
**Alternatives considered:**
- Gradual migration: Rejected due to risk of inconsistency during transition period
- Keep both terms: Rejected as it maintains confusion

### Decision: Backend API Endpoint Updates
**What:** Update all API endpoint paths from `/questions/*` to `/predictions/*`.
**Why:** Frontend and backend must use consistent terminology to avoid confusion.
**Alternatives considered:**
- Keep backend endpoints unchanged: Rejected as it creates inconsistency between frontend and backend

### Decision: Merge CreateQuestionData with CreatePredictionData
**What:** Remove `CreateQuestionData` type and use `CreatePredictionData` (or rename if needed).
**Why:** Avoid duplicate types with similar purposes.
**Alternatives considered:**
- Keep both types: Rejected as it creates confusion

### Decision: Directory Rename
**What:** Rename `src/components/questions/` to `src/components/predictions/`.
**Why:** Directory names should reflect the domain terminology.
**Alternatives considered:**
- Keep directory name: Rejected as it maintains inconsistency

## Risks / Trade-offs

### Risk: Breaking Changes
**Mitigation:** This is a breaking change that requires:
- Coordinated backend deployment
- Update of all API contracts
- Comprehensive testing of all API integrations

### Risk: Missed References
**Mitigation:** 
- Use comprehensive search (grep) to find all occurrences
- Review all files systematically
- Update OpenSpec change documents that reference old terminology

### Risk: Translation Key Updates
**Mitigation:**
- Update both English and Farsi translation files
- Ensure all user-facing error/success messages are updated

## Migration Plan

### Phase 1: Preparation
1. Document all occurrences of "question" terminology
2. Create comprehensive list of files to modify
3. Coordinate with backend team on API endpoint changes

### Phase 2: Code Changes
1. Update type definitions in `src/types/api.ts`
2. Update model classes in `src/models/`
3. Update service methods in `src/services/`
4. Update component files
5. Rename directory `src/components/questions/` to `src/components/predictions/`
6. Update translation files
7. Update import statements

### Phase 3: Validation
1. Run TypeScript compiler to catch type errors
2. Run linter to catch any missed references
3. Test all API integrations
4. Verify all components render correctly
5. Test user flows (create prediction, comment, like, share)

### Phase 4: Documentation
1. Update OpenSpec change documents that reference "question"
2. Update any README or documentation files
3. Update code comments and JSDoc

## Open Questions
- Should backend API versioning be used to support both old and new endpoints during transition?
- Are there any external integrations or webhooks that depend on the current endpoint names?

