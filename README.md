# Sales Radar: Real-Time Market Intelligence Engine

> A sophisticated market intelligence platform that identifies high-value niches by cross-referencing social media data with advanced language models for real-time opportunity scoring and trend analysis.

## 🏗️ Architecture Overview

SalesRadar is a comprehensive market intelligence engine designed to help content creators, marketers, and entrepreneurs identify profitable niches through data-driven analysis. The system combines real-time social media data with AI-powered qualitative analysis to provide actionable insights on market opportunities.

### Core Components

- **Radar Module**: Real-time trend detection and opportunity scoring
- **Fábrica Module**: AI-powered content script generation
- **Colador Module**: Comment analysis and reply automation
- **Data Pipeline**: Efficient API management with intelligent caching

## 🛠️ Tech Stack

### Frontend & UI
- **Next.js 16.1.6** - React framework with App Router
- **React 19** - Component library with concurrent features
- **Shadcn/UI** - Modern component library built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Declarative charting library for data visualization

### Backend & Data Processing
- **Node.js** - Server runtime
- **Prisma ORM** - Type-safe database access with SQLite
- **Next.js API Routes** - Serverless API endpoints

### External APIs & AI
- **YouTube Data API v3** - Video metadata and trend analysis
- **Groq AI (Llama 3)** - Low-latency LLM for qualitative analysis
- **TikTok API** (via RapidAPI) - Social media trend data
- **Instagram Graph API** - Hashtag and media analysis

### Infrastructure
- **Vercel** - Deployment and hosting platform
- **WebSocket** - Real-time notifications
- **Redis** (planned) - Caching and session management

## 🎯 The Opportunity Score Algorithm

The Opportunity Score represents a sophisticated quantification of market viability that combines multiple data dimensions to assess the profit potential of a given niche.

### Algorithm Components

#### 1. **CPM Estimation (Cost Per Mille)**
```
CPM_Score = (Average_Video_Views × Engagement_Rate × 0.001) × Platform_CPM_Rate
```
- **Average_Video_Views**: Mean view count across top-performing videos
- **Engagement_Rate**: Combined like ratio + comment ratio + share ratio
- **Platform_CPM_Rate**: YouTube's average CPM for the niche category

#### 2. **Competition Density Analysis**
```
Competition_Score = 1 / (1 + e^(-(Total_Videos - Optimal_Threshold) / Scaling_Factor))
```
- **Total_Videos**: Number of videos in the niche within time window
- **Optimal_Threshold**: 10,000-50,000 videos (sweet spot for competition)
- **Scaling_Factor**: 25,000 (controls curve steepness)

#### 3. **Real-Time Engagement Metrics**
```
Engagement_Index = (Views_24h × 0.3) + (Comments_24h × 0.4) + (Likes_24h × 0.3)
```
- **Views_24h**: Video views in last 24 hours
- **Comments_24h**: New comments in last 24 hours
- **Likes_24h**: New likes in last 24 hours

### Final Opportunity Score Calculation

```
Opportunity_Score = (CPM_Score × 0.4) + (Competition_Score × 0.3) + (Engagement_Index × 0.3)
```

### Score Interpretation
- **0-25**: Low opportunity - High competition, low monetization potential
- **26-50**: Medium opportunity - Balanced market conditions
- **51-75**: High opportunity - Favorable conditions with growth potential
- **76-100**: Premium opportunity - Optimal market conditions for immediate action

## ⚡ API Efficiency & Quota Management

SalesRadar implements a multi-layered approach to maximize API utilization while maintaining real-time data freshness.

### Rate Limiting Strategy

#### Tiered Request Distribution
```
Primary_API_Requests = min(Quota_Limit × 0.7, Required_Data_Points)
Fallback_API_Requests = Required_Data_Points - Primary_API_Requests
Mock_Data_Fallback = max(0, Required_Data_Points - Total_API_Requests)
```

#### Intelligent Quota Allocation
- **YouTube Data API**: 10,000 units/day allocated as:
  - 40% for trending video discovery
  - 35% for detailed video analytics
  - 25% for channel statistics
- **TikTok API**: 500 requests/minute with exponential backoff
- **Instagram API**: 200 requests/hour with priority queuing

### Advanced Caching Architecture

#### Multi-Level Caching Strategy
1. **Memory Cache** (5 minutes): Hot data for real-time dashboards
2. **Redis Cache** (1 hour): Computed scores and aggregations
3. **Database Cache** (24 hours): Historical trends and baselines

#### Cache Invalidation Logic
```
Cache_Validity = min(
  Time_Since_Last_Update,
  Data_Freshness_Threshold,
  API_Quota_Availability
)
```

#### Predictive Prefetching
```
Prefetch_Trigger = (User_Engagement_Score > 0.7) AND (Data_Age > Threshold)
Prefetch_Data = Trending_Videos + Related_Channels + Competitor_Analysis
```

## 🧠 Llama 3 Integration via Groq

The system leverages Groq's ultra-fast inference for real-time qualitative analysis of market data.

### Qualitative Analysis Pipeline

#### 1. **Metadata Aggregation**
```
Input_Vector = {
  video_titles: [...],
  descriptions: [...],
  tags: [...],
  comments: [...],
  engagement_metrics: {...}
}
```

#### 2. **LLM Processing Prompts**

**Niche Temperature Analysis:**
```
Analyze the following social media content and determine the market temperature for this niche.
Consider: hype level, sustainability indicators, monetization signals, and growth trajectory.

Content: {aggregated_metadata}

Provide a temperature score (0-100) and detailed reasoning.
```

**Opportunity Qualification:**
```
Evaluate the commercial viability of this niche based on:
- Content quality and uniqueness
- Audience engagement patterns
- Monetization potential indicators
- Competitive landscape analysis

Data: {processed_metrics}

Return: structured analysis with confidence score.
```

#### 3. **Temperature Scoring Algorithm**
```
Base_Temperature = LLM_Sentiment_Analysis_Score
Hype_Multiplier = Viral_Potential_Factor
Sustainability_Bonus = Long_Term_Engagement_Score

Final_Temperature = (Base_Temperature × 0.6) + (Hype_Multiplier × 0.3) + (Sustainability_Bonus × 0.1)
```

### Integration Benefits
- **Sub-second Response Times**: Groq's optimized inference
- **Cost-Effective Analysis**: Efficient token usage for batch processing
- **Real-time Adaptability**: Dynamic prompt engineering based on data patterns

## 📊 Data Visualization with Recharts

SalesRadar transforms raw API data into executive-ready dashboards using Recharts' declarative approach.

### Dashboard Components

#### Opportunity Score Visualization
```jsx
<ResponsiveContainer width="100%" height={400}>
  <RadarChart data={opportunityMetrics}>
    <PolarGrid />
    <PolarAngleAxis dataKey="metric" />
    <PolarRadiusAxis angle={90} domain={[0, 100]} />
    <Radar
      name="Opportunity Score"
      dataKey="score"
      stroke="#8884d8"
      fill="#8884d8"
      fillOpacity={0.3}
    />
  </RadarChart>
</ResponsiveContainer>
```

#### Real-Time Trend Analysis
```jsx
<LineChart data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="timestamp" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line
    type="monotone"
    dataKey="opportunityScore"
    stroke="#8884d8"
    strokeWidth={2}
    dot={{ fill: '#8884d8' }}
  />
  <Line
    type="monotone"
    dataKey="engagementIndex"
    stroke="#82ca9d"
    strokeWidth={2}
  />
</LineChart>
```

#### Competitive Landscape Mapping
```jsx
<ScatterChart
  width={800}
  height={400}
  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
>
  <CartesianGrid />
  <XAxis type="number" dataKey="competitionDensity" name="Competition" />
  <YAxis type="number" dataKey="monetizationPotential" name="Revenue Potential" />
  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
  <Scatter name="Niches" data={marketData} fill="#8884d8" />
</ScatterChart>
```

### Visualization Features
- **Real-time Updates**: WebSocket-powered live data streaming
- **Interactive Filtering**: Dynamic drill-down capabilities
- **Responsive Design**: Mobile-optimized charts and graphs
- **Export Functionality**: PNG/PDF generation for reports

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- API keys for YouTube, Groq, and social media platforms

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/salesradar.git
cd salesradar
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

4. **Run database migrations**
```bash
npx prisma migrate dev
```

5. **Start the development server**
```bash
npm run dev
```

### Environment Variables
```env
# AI & APIs
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
YOUTUBE_API_KEY=your_youtube_key

# Authentication
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"
```

## 📈 API Endpoints

### Radar Module
- `GET /api/radar/trending` - Fetch trending videos with opportunity scores
- `GET /api/radar/video/[id]/comments` - Get video comments with analysis

### Fábrica Module
- `POST /api/fabrica/generate-script` - Generate video scripts using AI

### Colador Module
- `GET /api/colador/comments` - Fetch and analyze comments
- `PATCH /api/colador/comments/[id]/reply` - Mark comment as replied

## 🔧 Development

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Automatic code formatting

### Testing
```bash
npm run test
npm run test:e2e
```

### Building for Production
```bash
npm run build
npm run start
```

## 📚 Additional Resources

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [Groq API Documentation](https://console.groq.com/docs)
- [Recharts Documentation](https://recharts.org/)
- [Next.js Documentation](https://nextjs.org/docs)

## 📄 License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ for market intelligence and opportunity discovery**
