# Technical Specifications Reference

This document serves as a central reference for all technical specifications and implementation guides for the Educational ERP project.

## Core Specifications

### Design System
- **[DESIGN.md](./DESIGN.md)** - Complete Eduportal design system specification
  - Organic Brutalism aesthetic principles
  - Specific color palette and usage rules
  - Typography standards (Geist/Geist Mono)
  - Layout, spacing, elevation, and component guidelines
  - Do's and Don'ts for implementation

### Frontend Implementation
- **[FE-IMPLEMENTATION-BREAKDOWN.md](./FE-IMPLEMENTATION-BREAKDOWN.md)** - Frontend implementation breakdown
  - Analysis of current implementation vs. mockups
  - Detailed implementation plan by component and phase
  - Design system compliance checklist
  - Integration guidelines with existing codebase

### Style Guide & Components
- **[StyleGuide.md](./StyleGuide.md)** - Current shadcn/ui-based style guide
  - Clean Modern SaaS design direction (current baseline)
  - Color palette, typography, spacing & layout conventions
  - Component conventions and iconography guidelines
- **[ReusableComponents.md](./ReusableComponents.md)** - Documentation of reusable UI components
  - Shadcn primitives to install and configure
  - Custom composites built for the project
  - Layout, navigation, feedback, and data display components

### Backend Specifications
*(References to backend documentation would go here)*

## Implementation Tracking

### Progress Tracking
- **[PROGRESS.md](./PROGRESS.md)** - Overall project progress tracking
  - Monorepo scaffold status
  - Backend API completion status
  - Frontend feature completion status
  - Testing coverage and completion

## How to Use This Reference

1. **For Design Questions**: Consult DESIGN.md for the Eduportal visual design system
2. **For Implementation Planning**: Consult FE-IMPLEMENTATION-BREAKDOWN.md for phased approach
3. **For Component Usage**: Consult StyleGuide.md and ReusableComponents.md
4. **For Progress Tracking**: Consult PROGRESS.md to see what's completed and what's in progress
5. **For Technical Decisions**: Use this document as a central reference point

## Relationship Between Documents

```
DESIGN.md (Design System Spec)
        ↓
FE-IMPLEMENTATION-BREAKDOWN.md (How to implement the design)
        ↓
StyleGuide.md + ReusableComponents.md (Current implementation baseline)
        ↓
PROGRESS.md (Tracking implementation against plan)
```