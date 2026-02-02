# Severity Classification Rules

## Overview
This document outlines the rules and guidelines used to classify news items by severity level. The system uses keyword-based detection combined with AI analysis to determine the importance and urgency of each news item.

## Severity Levels

### 🔴 CRITICAL (Highest Priority)
**Definition:** Immediate threat to operations, safety, or major political change requiring urgent action.

**Triggers:**
- Coup attempts or military action
- Armed conflict or war
- Assassination or assassination attempts
- Regime change
- Martial law or state of emergency declarations
- Invasion or foreign military intervention
- Terrorist attacks
- Major violence or civil war
- Widespread casualties

**Example Headlines:**
- "Military coup underway in Caracas"
- "State of emergency declared nationwide"
- "Armed conflict erupts at border"

**Alert Behavior:** Immediate notification, highest priority display

---

### 🟠 HIGH (Urgent Attention Required)
**Definition:** Significant impact on business operations, security, or diplomatic relations.

**Triggers:**
- Crisis situations (political, economic, humanitarian)
- Urgent breaking news
- Major protests or riots
- Government collapse
- Diplomatic crisis
- Oil embargo or major energy disruptions
- Border or airport closures
- Mass arrests
- Humanitarian crisis
- Food or medicine shortages
- Major power outages

**Example Headlines:**
- "Humanitarian crisis worsens as food shortages spread"
- "Major protests shut down Caracas"
- "Airport closed indefinitely"

**Alert Behavior:** Priority notification, requires monitoring

---

### 🟡 MEDIUM (Important Monitoring)
**Definition:** Important developments that require tracking but not immediate action.

**Triggers:**
- Elections or electoral processes
- Protests (non-violent)
- Sanctions announcements or changes
- Policy changes
- Economic reforms
- Trade restrictions
- Diplomatic tensions
- Opposition leader activities
- International pressure
- Human rights developments
- Corruption investigations
- Oil production changes
- Inflation reports
- Currency devaluation

**Example Headlines:**
- "New sanctions announced by US"
- "Opposition leader calls for protests"
- "Oil production drops 15%"

**Alert Behavior:** Standard notification, tracked in reports

---

### ⚪ LOW (General Information)
**Definition:** General news and updates without immediate operational impact.

**Triggers:**
- Routine government announcements
- General economic indicators
- Cultural events
- Non-urgent diplomatic meetings
- Background analysis pieces
- Historical context articles

**Example Headlines:**
- "President attends regional summit"
- "Economic analysis: Venezuela's outlook"
- "Cultural festival planned for next month"

**Alert Behavior:** No alert generated, available in news feed

---

## Breaking News Classification

News items are marked as "Breaking" if they meet ANY of these criteria:

1. **Keyword Indicators:**
   - "Breaking", "Just in", "Developing", "Urgent", "Alert"
   - "Announced", "Confirmed", "Reports of", "Happening now"

2. **Severity-Based:**
   - All CRITICAL severity items
   - All HIGH severity items

3. **Time-Sensitive:**
   - Recent announcements from government officials
   - Immediate policy changes
   - Ongoing events

---

## Context-Based Adjustments

### Maduro-Related News
News involving President Maduro receives elevated priority when combined with action verbs:
- "Maduro announces..." → Minimum MEDIUM severity
- "Maduro orders..." → Minimum MEDIUM severity
- "Maduro decrees..." → Minimum MEDIUM severity

### Oil & Energy Sector
Venezuela's oil industry is critical to operations:
- Oil embargo → HIGH severity
- Production changes >10% → MEDIUM severity
- Routine production reports → LOW severity

### Diplomatic Relations
- Crisis or breakdown → HIGH severity
- Tensions or disputes → MEDIUM severity
- Routine meetings → LOW severity

---

## AI-Enhanced Classification

The system uses Google's Gemini AI to provide additional context and analysis:

1. **Content Analysis:** AI reviews full article content, not just headlines
2. **Sentiment Analysis:** Determines positive, negative, or neutral tone
3. **Entity Extraction:** Identifies key people, organizations, locations
4. **Keyword Generation:** Extracts relevant tags for categorization
5. **Summary Generation:** Creates concise 2-3 sentence summaries

**Fallback:** If AI is unavailable, keyword-based rules ensure classification continues

---

## Alert Generation Rules

Alerts are automatically created for:
- ✅ CRITICAL severity items (always)
- ✅ HIGH severity items (always)
- ✅ MEDIUM severity items (always)
- ✅ Any item marked as "Breaking News"
- ❌ LOW severity items (no alerts)

---

## Category Classification

News items are also categorized by topic:

- **KEY_EVENTS:** Major developments, breaking news, significant incidents
- **POLITICAL:** Government actions, policy changes, international relations
- **ECONOMIC:** Economic indicators, trade, sanctions, oil production
- **SOCIAL:** Humanitarian issues, migration, protests, public sentiment
- **ANALYSIS:** Expert analysis, opinion pieces, background context

---

## Monitoring Frequency

- **Automatic Collection:** Every 5 minutes
- **Manual Trigger:** Available via Admin Controls in dashboard
- **Sources Monitored:**
  - NewsAPI (50+ international sources)
  - Google News RSS feeds
  - BBC, Al Jazeera, NY Times RSS
  - Twitter (when API credits available)
  - Telegram channels
  - Facebook pages

---

## Quality Assurance

To ensure accuracy:
1. Duplicate detection prevents repeated alerts
2. Content validation filters out invalid/malformed data
3. Source credibility tracking
4. Human review recommended for CRITICAL items
5. Regular keyword list updates based on current events

---

## Customization

Severity rules can be adjusted in:
`backend/src/services/monitoringService.ts`

To add new keywords or adjust thresholds, modify the keyword arrays in the `processItem` method.

---

## Demo Mode Features

For demonstrations, the system includes:
- **Manual Triggers:** Run monitoring and generate reports on-demand
- **Real-time Updates:** WebSocket notifications for breaking news
- **Visual Indicators:** Color-coded severity levels
- **Live Statistics:** Real-time dashboard metrics

---

*Last Updated: February 2, 2026*
