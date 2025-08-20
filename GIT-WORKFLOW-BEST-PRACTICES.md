# Git Workflow Best Practices for Agentic Development

## 🎯 **STRATEGIC APPROACH: Context-Driven Commits**

The goal is to create a git history that tells the story of business decisions and customer value creation, not just code changes.

---

## 📋 **COMMIT STRATEGY**

### **Commit Message Format**
```
<type>: <business-impact-description>

<detailed-context>
- Customer impact: <how this helps contractors>
- Technical change: <what was implemented>
- Business value: <revenue/retention/satisfaction impact>

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

### **Commit Types**
- `feat:` - New customer-facing functionality
- `enhance:` - Improvement to existing customer experience  
- `fix:` - Bug that was blocking customer success
- `strategy:` - Business model or strategic decision
- `docs:` - Documentation for future development sessions
- `test:` - Customer journey validation
- `refactor:` - Code improvement without customer impact

---

## 🚀 **BRANCHING STRATEGY**

### **Main Branch Protection**
```bash
main - Production-ready code only
├── Always deployable
├── Only merge through PRs
└── Requires working tests
```

### **Feature Branch Naming**
```bash
# Business feature branches
feat/sprint-005-real-creative-generation
feat/template-booster-platform
feat/figma-api-integration

# Strategic decision branches
strategy/meta-integration-vs-creative-generation
strategy/template-marketplace-design

# Customer journey branches
journey/contractor-campaign-creation
journey/real-ad-deployment
```

### **Branch Workflow**
```bash
# Start new feature
git checkout -b feat/sprint-005-real-creative-generation
git push -u origin feat/sprint-005-real-creative-generation

# Regular commits with context
git add .
git commit -m "feat: implement real Figma API creative generation

Customer impact: Contractors now receive actual usable advertising campaigns instead of mock URLs
Technical change: Complete Figma API integration with logo processing and dynamic text overlay
Business value: Transforms consultation service into real creative automation platform

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Merge to main with PR
gh pr create --title "Sprint 005: Real Creative Generation MVP" --body "..."
```

---

## 📖 **DOCUMENTATION-DRIVEN DEVELOPMENT**

### **Commit Documentation Pattern**
Every significant commit should update relevant documentation:

```bash
# Feature implementation
src/lib/figma.ts                    # Code
docs/SPRINT-005-IMPLEMENTATION.md   # Technical docs  
.claude/decisions/sprint-005.md     # Strategic context
.claude/context/current-state.md    # Updated state

# All committed together with business context
```

### **Decision Documentation**
```bash
# Strategic decisions go in .claude/decisions/
.claude/decisions/sprint-005-booster-platform-strategy.md
.claude/decisions/figma-vs-canva-api-choice.md
.claude/decisions/progressive-implementation-approach.md
```

### **Context Preservation**
```bash
# Session context in .claude/context/
.claude/context/project.md                 # Overall project state
.claude/context/current-session-summary.md # Latest session
.claude/context/business-intelligence.md   # Customer insights
```

---

## 🔄 **AGENT COLLABORATION WORKFLOW**

### **Session Handoff Process**
1. **Document Session**: Update `.claude/context/current-session-summary.md`
2. **Record Decisions**: Create `.claude/decisions/[session-focus].md`
3. **Prepare Handoff**: Update `.claude/prompts/next-session-start.md`
4. **Commit Context**: Single commit with all context changes
5. **Push for Continuity**: Ensure next agent has full context

### **Context Commit Example**
```bash
git add .claude/
git commit -m "docs: session handoff for Sprint 005 Template Booster Platform

Agent collaboration: Complete context for real creative generation implementation
Business impact: Strategic foundation for 172% LTV increase through template marketplace
Next session focus: Week 1 Figma implementation with progressive build approach

Context includes:
- Sprint 005 technical architecture and implementation guide
- Template Booster Platform business model transformation
- Progressive implementation strategy (build → expand → replicate)
- Figma API integration specifications and fallback systems

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 🧪 **TESTING INTEGRATION**

### **Test-Driven Commits**
```bash
# Write test first
tests/e2e/contractor-real-ad-generation.spec.ts

# Implement feature
src/lib/figma.ts

# Commit both together
git add tests/ src/
git commit -m "feat: contractor can generate real usable ads for Facebook deployment

Customer journey: Contractor enters business info → receives downloadable PNG files → deploys to Facebook
Test validation: End-to-end journey from payment to campaign launch
Business value: Transforms mock template consultation into real creative automation

🤖 Generated with Claude Code  
Co-Authored-By: Claude <noreply@anthropic.com>"
```

### **Customer Journey Tests**
```bash
# Test names focus on business outcomes
"contractor-books-20-appointments-in-28-days.spec.ts"
"contractor-deploys-real-ads-to-facebook.spec.ts"  
"contractor-chooses-template-variants.spec.ts"
```

---

## 📊 **CURRENT SESSION COMMIT PLAN**

### **Major Commit: Sprint 005 + Booster Platform**
```bash
# Stage all work
git add .

# Comprehensive commit message
git commit -m "feat: Sprint 005 Real Creative Generation + Template Booster Platform Strategy

MAJOR TRANSFORMATION: Windows Ad Kit now delivers real usable advertising campaigns

Customer impact:
- Contractors receive actual PNG/JPG files instead of mock URLs
- Immediate deployment to Facebook/Instagram campaigns
- Professional quality with logo processing and dynamic text overlay
- Customer choice through Template Booster Platform (172% LTV increase)

Technical implementation:
- Complete Figma API integration (src/lib/figma.ts, src/lib/figma-real.ts)
- Asset delivery pipeline (src/app/api/assets/pipeline/route.ts)
- Quality assurance system with customer preview workflow
- Progressive implementation strategy for scaling complexity

Business model transformation:
- Base Package: 72 templates across sectors (\$295)
- Template Packs: Style/Seasonal/Industry/Performance (\$67-\$197 upsells)
- Total LTV potential: \$803 (172% increase from \$295 current)
- Recurring revenue through template marketplace

Strategic approach:
- Progressive implementation: Build → Expand → Replicate
- Week 1: Single file foundation (1 angle, 4 formats)
- Week 2-4: Scale to full template marketplace
- Risk reduction through validated learning approach

Documentation created:
- SPRINT-005-IMPLEMENTATION.md (complete technical guide)
- FIGMA-BOOSTER-IMPLEMENTATION.md (progressive development strategy)  
- TEMPLATE-BOOSTER-PLATFORM-STRATEGY.md (business model transformation)
- .claude/decisions/sprint-005-booster-platform-strategy.md (strategic context)
- .claude/context/current-session-summary.md (agent handoff)

Next session: Week 1 Figma implementation with real API integration

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 🔧 **REPOSITORY STRUCTURE**

### **Organized Documentation**
```
windows-ad-kit/
├── .claude/                          # Agent collaboration context
│   ├── context/                      # Project state and session summaries
│   ├── decisions/                    # Strategic decision records
│   ├── prompts/                      # Agent startup templates
│   └── sprints/                      # Sprint planning and retrospectives
├── docs/                            # Technical documentation
│   ├── business/                    # Business strategy and model docs
│   ├── technical/                   # Implementation guides
│   └── decisions/                   # Legacy decision records
├── src/                            # Source code
├── tests/                          # Customer journey tests
└── [implementation files]
```

### **Context Discoverability**
```bash
# Quick context loading for agents
cat .claude/context/current-session-summary.md
cat .claude/decisions/sprint-005-booster-platform-strategy.md
cat .claude/prompts/next-session-start.md
```

---

## 🎯 **SUCCESS METRICS FOR GIT WORKFLOW**

### **Agent Continuity**
- [ ] Next agent can understand project state in < 5 minutes
- [ ] Strategic context preserved across sessions
- [ ] Technical implementation details documented
- [ ] Business impact clearly communicated

### **Development History**
- [ ] Git log tells story of customer value creation
- [ ] Commit messages explain business reasoning
- [ ] Strategic decisions traceable through history
- [ ] Agent collaboration visible and documented

### **Deployment Readiness**
- [ ] Main branch always deployable
- [ ] Features validated with customer journey tests
- [ ] Documentation up-to-date with implementation
- [ ] Context preserved for production support

---

**This git workflow supports agentic development by preserving context, documenting strategic decisions, and maintaining a deployable main branch that tells the story of customer value creation.**